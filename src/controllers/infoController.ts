import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { getResolversFromProject } from "../util/util";
import AdmZip from "adm-zip";
import CodeFile from "../generator/codeFile";

@Controller("api/v1/info")
class InfoController {
  @Get(":project/resolvers")
  resolvers(req: Request, res: Response) {
    const { params, session } = req;
    const { project } = params;

    if (!session[project]) {
      res.status(BAD_REQUEST).json({
        error: `No project with name ${project} found in current session`
      });

      return;
    }

    const resolvers = getResolversFromProject(session[project]);

    if (!resolvers || resolvers.length === 0) {
      res
        .status(OK)
        .json({ message: `No resolvers uploaded for project ${project}` });
    }

    const buff = this.zipFiles(...resolvers);

    res
      .set({
        "Content-Disposition": 'attachment; filename="resolvers.zip"',
        "Content-Type": "application/zip"
      })
      .status(OK)
      .send(buff);
  }

  @Get(":project/dependencies")
  dependencies(req: Request, res: Response) {
    const { params, session } = req;
    const { project } = params;

    if (!session[project]) {
      res.status(BAD_REQUEST).json({
        error: `No project with name ${project} found in current session`
      });

      return;
    }

    const dependency: CodeFile = session[project].dependency;

    if (!dependency) {
      res
        .status(OK)
        .json({ message: `No dependencies uploaded for project ${project}` });
    }

    const buff = this.zipFiles(dependency);

    res
      .set({
        "Content-Disposition": 'attachment; filename="dependencies.zip"',
        "Content-Type": "application/zip"
      })
      .status(OK)
      .send(buff);
  }

  @Get(":project/schema")
  schema(req: Request, res: Response) {
    const { params, session } = req;
    const { project } = params;

    if (!session[project]) {
      res.status(BAD_REQUEST).json({
        error: `No project with name ${project} found in current session`
      });

      return;
    }

    const schema: CodeFile = session[project].schema;

    if (!schema) {
      res
        .status(OK)
        .json({ message: `No schema uploaded for project ${project}` });
    }

    const buff = this.zipFiles(schema);

    res
      .set({
        "Content-Disposition": 'attachment; filename="schema.zip"',
        "Content-Type": "application/zip"
      })
      .status(OK)
      .send(buff);
  }

  private zipFiles(...files: CodeFile[]) {
    const zipper = new AdmZip();

    for (const { filename, content } of files) {
      zipper.addFile(filename, Buffer.alloc(content.length, content));
    }

    return zipper.toBuffer();
  }
}

export default InfoController;
