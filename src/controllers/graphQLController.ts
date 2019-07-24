import { Controller, Post, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import * as validators from "../controllers/validators";
import { buildSchema, validateSchema } from "graphql";
import FileType from "../generator/fileType";
import CodeFile from "../generator/codeFile";
import { extname } from "path";

@Controller("api/v1/graphql")
class GraphQLController {
  @Post("resolvers")
  @Middleware(validators.fileValidator(["*"], [".js"]))
  resolvers(req: Request, res: Response) {
    for (const file in req.files) {
      let { data, name } = req.files[file] as UploadedFile;

      const resolver: CodeFile = {
        filename: name,
        content: data.toString("utf-8"),
        type: FileType.Resolver
      };

      const keyName = /resolver(s?)/i.test(name) ? file : file + "Resolver";
      req.session[keyName] = resolver;
    }

    res.sendStatus(OK);
  }

  @Post("dependencies")
  @Middleware(validators.fileValidator(["package"], [".json"]))
  dependencies(req: Request, res: Response) {
    const { data, name } = req.files.package as UploadedFile;

    const dependency: CodeFile = {
      filename: name,
      content: data.toString("utf-8"),
      type: FileType.Dependecy
    };

    req.session.dependency = dependency;
    res.sendStatus(OK);
  }

  @Post("schema")
  @Middleware(validators.fileValidator(["schema"], [".graphql", ".js"]))
  schema(req: Request, res: Response) {
    const { data, name } = req.files.schema as UploadedFile;
    const content = data.toString("utf-8");

    // TODO add validation fro .js schema
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

    req.session.schema = schema;
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
