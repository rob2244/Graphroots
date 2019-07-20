import { Controller, Post, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import * as validators from "../controllers/validators";
import { buildSchema } from "graphql";

@Controller("api/v1/graphql")
class GraphQLController {
  @Post("resolvers")
  @Middleware(validators.fileValidator("resolvers", [".js"]))
  resolvers(req: Request, res: Response) {
    const { data } = req.files.resolvers as UploadedFile;
    req.session.resolvers = data.toString("utf-8");
    res.sendStatus(OK);
  }

  @Post("dependencies")
  @Middleware(validators.fileValidator("package", [".json"]))
  dependencies(req: Request, res: Response) {
    const { data } = req.files.package as UploadedFile;
    req.session.resolvers = data.toString("utf-8");
    res.sendStatus(OK);
  }


  @Post("schema")
  @Middleware(validators.fileValidator("schema", [".graphql"]))
  schema(req: Request, res: Response) {
    const { data } = req.files.schema as UploadedFile;
    const schema = data.toString("utf-8");

    const errors = this.validateSchema(schema);
    if (errors) {
      res.status(BAD_REQUEST).json({ errors });
      return;
    }

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