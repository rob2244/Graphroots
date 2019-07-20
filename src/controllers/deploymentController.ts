import { CREATED, BAD_REQUEST } from "http-status-codes";
import { Controller, Post, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { createDeployer } from "../deployer/deployerFactory";
import IGenerator from "../generator/generator";
import CodeFile from "../generator/codeFile";
import DeployerType from "../deployer/deployerType";
import * as validators from "./validators";

@Controller("api/v1/deployment")
class DeploymentController {
  constructor(
    private deployerFactory: createDeployer,
    private generator: IGenerator
  ) {}

  @Post()
  @Middleware(validators.azureDeploymentValidation)
  async deploy(req: Request, res: Response) {
    const { schema, resolvers } = req.session;

    if (!schema) {
      res
        .status(BAD_REQUEST)
        .send({ error: "No graphql schema found in current session" });

      return;
    }

    if (!resolvers) {
      res
        .status(BAD_REQUEST)
        .send({ error: "No graphql resolvers found in current session" });

      return;
    }

    const deployer = this.createDeployer(req.body);

    const codeFiles = this.createCodeFiles(schema, resolvers);

    const { generator } = this;
    const files = generator.generate(codeFiles);

    await deployer.deployResources();
    await deployer.deployApplication(files);

    res.sendStatus(CREATED);
  }

  private createDeployer(requestBody: { [key: string]: string }) {
    const { deployerFactory } = this;
    const { cloudType, ...ctx } = requestBody;

    return deployerFactory(cloudType as DeployerType, ctx);
  }

  private createCodeFiles(schema: string, resolvers: string): CodeFile[] {
    return [
      { filename: "schema.graphql", content: schema },
      { filename: "resolvers.js", content: resolvers }
    ];
  }
}

export default DeploymentController;
