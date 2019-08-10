import FileType from "./fileType";

export default interface CodeFile {
  filename: string;
  content: string;
  type: FileType;
}
