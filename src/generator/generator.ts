import CodeFile from "./codeFile";

export default interface IGenerator {
  generate(code: CodeFile[]): Buffer;
}
