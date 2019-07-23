import AdmZip from "adm-zip";
import path from "path";
import IGenerator from "./generator";
import CodeFile from "./codeFile";
import { promisify } from "util";
import { readFile } from "fs";
import FileType from "./fileType";
import { render } from "mustache";
import { basename } from "path";

const readFileAsync = promisify(readFile);

export default class JavascriptGenerator implements IGenerator {
  async generate(code: CodeFile[]) {
    const zipper = new AdmZip();

    const template = await this.renderTemplate(code);
    zipper.addFile("index.js", Buffer.alloc(template.length, template));

    zipper.addLocalFolder(
      path.resolve(__dirname, "../templates/javascript"),
      null,
      /.*\.json/
    );

    for (const { filename, content } of code) {
      zipper.addFile(filename, Buffer.alloc(content.length, content));
    }

    return zipper.toBuffer();
  }

  private async renderTemplate(code: CodeFile[]) {
    const template = await readFileAsync(
      path.resolve(__dirname, "../templates/javascript/index.js"),
      "utf-8"
    );

    const resolvers = code.filter(c => c.type === FileType.Resolver);
    return render(template, {
      resolvers,
      trimExt() {
        return basename(this.filename, ".js");
      }
    });
  }
}
