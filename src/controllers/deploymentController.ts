import { CREATED, BAD_REQUEST } from "http-status-codes";
import { Controller, Post, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { createDeployer } from "../deployer/deployerFactory";
import IGenerator from "../generator/generator";
import CodeFile from "../generator/codeFile";
import DeployerType from "../deployer/deployerType";
import * as validators from "./validators";
import FileType from "../generator/fileType";

@Controller("api/v1/deployment")
class DeploymentController {
  constructor(
    private deployerFactory: createDeployer,
    private generator: IGenerator
  ) {}

  @Post()
  @Middleware(validators.azureDeploymentValidation)
  async deploy(req: Request, res: Response) {
    const { schema, dependency = null } = req.session;

    if (!schema) {
      res
        .status(BAD_REQUEST)
        .send({ error: "No graphql schema found in current session" });

      return;
    }

    const resolvers = this.getResolversFromSession(req.session);

    if (resolvers.length === 0) {
      res
        .status(BAD_REQUEST)
        .send({ error: "No graphql resolvers found in current session" });

      return;
    }

    const deployer = this.createDeployer(req.body);

    const codeFiles = this.createCodeFiles(schema, resolvers, dependency);

    const { generator } = this;

    const files = await generator.generate(codeFiles);

    await deployer.deployResources();
    await deployer.deployApplication(files);

    res.sendStatus(CREATED);
  }

  private getResolversFromSession(session: Express.Session): CodeFile[] {
    const keys = Object.keys(session).filter(k => /resolver(s?)/i.test(k));
    return keys.map(k => session[k]);
  }

  private createDeployer(requestBody: { [key: string]: string }) {
    const { deployerFactory } = this;
    const { cloudType, ...ctx } = requestBody;

    return deployerFactory(cloudType as DeployerType, ctx);
  }

  private createCodeFiles(
    schema: CodeFile,
    resolvers: CodeFile[],
    dependency: CodeFile | null
  ): CodeFile[] {
    const files = [schema, ...resolvers];

    if (dependency) {
      files.push(dependency);
    }

    return files;
  }
}

export default DeploymentController;
