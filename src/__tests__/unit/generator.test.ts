import JavascriptGenerator from "../../generator/javascriptGenerator";
import { promisify } from "util";
import { readFile } from "fs";
import { resolve, join } from "path";
import AdmZip from "adm-zip";

const readFileAsync = promisify(readFile);
const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");

describe("JavascriptGenerator", () => {
  let generator: JavascriptGenerator;
  let resolvers: string;
  let schema: string;

  beforeAll(async () => {
    generator = new JavascriptGenerator();
    resolvers = await readFileAsync(join(graphqlpath, "resolvers.js"), "utf-8");
    schema = await readFileAsync(join(graphqlpath, "schema.graphql"), "utf-8");
  });

  it("Should correctly zip files for graphql server", () => {
    const codefiles = [
      { filename: "resolvers.js", content: resolvers },
      { filename: "schema.js", content: schema }
    ];

    const output = generator.generate(codefiles);

    const unzipper = new AdmZip(output);

    const zippedResolvers = unzipper.readAsText("resolvers.js");
    const zippedSchema = unzipper.readAsText("schema.js");

    expect(resolvers).toBeTruthy();
    expect(zippedResolvers).toBeTruthy();
    expect(resolvers).toContain(zippedResolvers);

    expect(schema).toBeTruthy();
    expect(zippedSchema).toBeTruthy();
    expect(schema).toContain(zippedSchema);
  });
});
