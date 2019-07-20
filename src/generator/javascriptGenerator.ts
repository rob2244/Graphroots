import AdmZip from "adm-zip";
import path from "path";
import IGenerator from "./generator";
import CodeFile from "./codeFile";

export default class JavascriptGenerator implements IGenerator {
  generate(code: CodeFile[]) {
    const zipper = new AdmZip();

    zipper.addLocalFolder(path.resolve(__dirname, "../templates/javascript"));

    for (const { filename, content } of code)
      zipper.addFile(filename, Buffer.alloc(content.length, content));

    return zipper.toBuffer();
  }
}
