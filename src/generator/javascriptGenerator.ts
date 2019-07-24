import AdmZip from "adm-zip";
import path, { extname } from "path";
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

    const isGQLSchemaLanguage =
      extname(code.find(c => c.type === FileType.Schema).filename) ===
      ".graphql";

    const template = await this.renderIndexTemplate(code, isGQLSchemaLanguage);
    zipper.addFile("index.js", Buffer.alloc(template.length, template));

    const pkg = await this.createPackageJSON(code);
    zipper.addFile("package.json", Buffer.alloc(pkg.length, pkg));

    zipper.addLocalFile(
      path.resolve(__dirname, "../templates/javascript/package-lock.json")
    );

    for (const { filename, content, type } of code) {
      if (type === FileType.Dependecy) continue;
      zipper.addFile(filename, Buffer.alloc(content.length, content));
    }

    return zipper.toBuffer();
  }

  private async renderIndexTemplate(
    code: CodeFile[],
    isGQLSchemaLanguage: boolean
  ) {
    const template = await readFileAsync(
      path.resolve(__dirname, "../templates/javascript/index.js"),
      "utf-8"
    );

    const resolvers = code.filter(c => c.type === FileType.Resolver);
    return render(template, {
      resolvers,
      trimExt() {
        return basename(this.filename, ".js");
      },
      isGQLSchemaLanguage
    });
  }

  private async createPackageJSON(code: CodeFile[]) {
    const template = await readFileAsync(
      path.resolve(__dirname, "../templates/javascript/package.json"),
      "utf-8"
    );

    const deps = code.find(c => c.type === FileType.Dependecy);
    if (!deps) return template;

    const templateJSON = JSON.parse(template);
    const packageJSON = JSON.parse(deps.content);

    const dependencies = {
      ...templateJSON.dependencies,
      ...packageJSON.dependencies
    };

    return JSON.stringify({ ...templateJSON, dependencies });
  }
}
