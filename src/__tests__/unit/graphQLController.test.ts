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
        resolvers: { data: testBuffer }
      },
      session: {}
    };

    const res: any = { sendStatus: jest.fn() };

    controller.resolvers(req, res);

    expect(req.session.resolvers).toBe("Test Buffer");
    expect(res.sendStatus).toHaveBeenCalledWith(OK);
  });

  it(`should correctly save a schema to the redis 
      store when the schema method is called`, async () => {
    const readFileAsync = promisify(readFile);
    const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");
    const schema = await readFileAsync(join(graphqlpath, "schema.graphql"));

    const req: any = {
      files: {
        schema: { data: schema }
      },
      session: {}
    };

    const res: any = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnValue({ json: jest.fn() })
    };

    controller.schema(req, res);

    expect(req.session.schema).toBe(schema.toString("utf-8"));
    expect(res.sendStatus).toHaveBeenCalledWith(OK);
  });

  it(`should return back a bad request with an array of 
      errors on an invalid graph ql schema`, () => {
    const req: any = {
      files: {
        schema: { data: Buffer.from("invalid schema") }
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
