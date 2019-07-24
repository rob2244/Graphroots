import GraphQLController from "../../controllers/graphQLController";
import { OK, BAD_REQUEST } from "http-status-codes";
import { resolve, join } from "path";
import { promisify } from "util";
import { readFile } from "fs";
import { GraphQLError } from "graphql";

describe("GraphQLController Unit Tests", () => {
  let controller: GraphQLController;

  beforeEach(() => {
    controller = new GraphQLController();
  });

  it(`should correctly save a buffer to the redis store 
      when the resolvers method is called`, () => {
    const testBuffer = Buffer.from("Test Buffer");

    const req: any = {
      files: {
        resolvers: { data: testBuffer, name: "resolvers.js" }
      },
      session: {}
    };

    const res: any = { sendStatus: jest.fn() };

    controller.resolvers(req, res);

    const resolver = req.session["resolvers"].content;

    expect(resolver).toBe("Test Buffer");
    expect(res.sendStatus).toHaveBeenCalledWith(OK);
  });

  it(`should correctly save multiple buffers to the redis store 
      when multiple resolver files are sent`, () => {
    const testBuffer1 = Buffer.from("Test Buffer 1");
    const testBuffer2 = Buffer.from("Test Buffer 2");
    const testBuffer3 = Buffer.from("Test Buffer 3");

    const req: any = {
      files: {
        resolver1: { data: testBuffer1, name: "resolvers1.js" },
        resolver2: { data: testBuffer2, name: "resolvers2.js" },
        resolver3: { data: testBuffer3, name: "resolvers3.js" }
      },
      session: {}
    };

    const res: any = { sendStatus: jest.fn() };

    controller.resolvers(req, res);

    const result1 = req.session["resolver1"].content;
    const result2 = req.session["resolver2"].content;
    const result3 = req.session["resolver3"].content;

    expect(result1).toBe("Test Buffer 1");
    expect(result2).toBe("Test Buffer 2");
    expect(result3).toBe("Test Buffer 3");
    expect(res.sendStatus).toHaveBeenCalledWith(OK);
  });

  it(`should correctly save a schema to the redis 
      store when the schema method is called`, async () => {
    const readFileAsync = promisify(readFile);
    const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");
    const schema = await readFileAsync(join(graphqlpath, "schema.graphql"));

    const req: any = {
      files: {
        schema: { data: schema, name: "schema.graphql" }
      },
      session: {}
    };

    const res: any = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() })
    };

    controller.schema(req, res);

    expect(req.session.schema.content).toBe(schema.toString("utf-8"));
    expect(res.sendStatus).toHaveBeenCalledWith(OK);
  });

  it(`should return back a bad request with an array of 
      errors on an invalid graph ql schema`, () => {
    const req: any = {
      files: {
        schema: { data: Buffer.from("invalid schema"), name: "schema.graphql" }
      },
      session: { save: jest.fn() }
    };

    const errorFunc = jest.fn();

    const res: any = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnValue({ json: errorFunc })
    };

    controller.schema(req, res);

    expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
    expect(errorFunc).toHaveBeenCalledWith({
      errors: new GraphQLError('Syntax Error: Unexpected Name "invalid"')
    });
  });
});
