import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { OK } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import { Logger } from "@overnightjs/logger";

@Controller("/api/v1/graphql")
class GraphQLController {
  @Post("resolvers")
  resolvers(req: Request, res: Response) {
    const { data } = req.files.resolvers as UploadedFile;
    req.session.resolvers = data.toString("utf-8");

    req.session.save(msg => Logger.Err(msg));
    return res.sendStatus(OK);
  }

  @Post("schema")
  schema(req: Request, res: Response) {
    const { data } = req.files.schema as UploadedFile;
    req.session.schema = data.toString("utf-8");

    req.session.save(msg => Logger.Err(msg));
    return res.sendStatus(OK);
  }
}

export default GraphQLController;
