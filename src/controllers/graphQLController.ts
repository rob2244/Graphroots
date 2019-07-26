import { Controller, Post, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import * as validators from "../controllers/validators";
import { buildSchema } from "graphql";
import FileType from "../generator/fileType";
import CodeFile from "../generator/codeFile";
import { extname } from "path";
import { createProjectIfNotExists } from "../util/util";
import { Logger } from "@overnightjs/logger";

@Controller("api/v1/graphql")
class GraphQLController {
  @Post(":project/resolvers")
  @Middleware(validators.fileValidator(["*"], [".js"]))
  resolvers(req: Request, res: Response) {
    const { project } = req.params;
    createProjectIfNotExists(req.session, project);

    for (const file in req.files) {
      let { data, name } = req.files[file] as UploadedFile;

      const resolver: CodeFile = {
        filename: name,
        content: data.toString("utf-8"),
        type: FileType.Resolver
      };

      const keyName = /resolver(s?)/i.test(name) ? file : file + "Resolver";
      req.session[project][keyName] = resolver;
    }

    res.sendStatus(OK);
  }

  @Post(":project/dependencies")
  @Middleware(validators.fileValidator(["package"], [".json"]))
  dependencies(req: Request, res: Response) {
    const { project } = req.params;
    createProjectIfNotExists(req.session, project);
    const { data, name } = req.files.package as UploadedFile;

    const dependency: CodeFile = {
      filename: name,
      content: data.toString("utf-8"),
      type: FileType.Dependecy
    };

    req.session[project].dependency = dependency;
    res.sendStatus(OK);
  }

  @Post(":project/schema")
  @Middleware(validators.fileValidator(["schema"], [".graphql", ".js"]))
  schema(req: Request, res: Response) {
    const { project } = req.params;
    createProjectIfNotExists(req.session, project);

    const { data, name } = req.files.schema as UploadedFile;
    const content = data.toString("utf-8");

    if (extname(name) === ".graphql") {
      const errors = this.validateSchema(content);
      if (errors) {
        res.status(BAD_REQUEST).json({ errors });
        return;
      }
    }

    const schema: CodeFile = {
      filename: name,
      content,
      type: FileType.Schema
    };

    req.session[project].schema = schema;
    res.sendStatus(OK);
  }

  private validateSchema(schema: string) {
    try {
      buildSchema(schema);
    } catch (err) {
      return err;
    }
  }
}

export default GraphQLController;
