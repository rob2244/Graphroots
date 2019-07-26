import GraphrootsServer from "../../server";
import { resolve, join } from "path";
import request from "supertest";

describe("Info controller integration tests", () => {
  let server: GraphrootsServer;
  const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");

  beforeAll(() => {
    server = new GraphrootsServer();
  });

  it(`Should return a zip file with all the currently 
      uploaded resolvers when a get request is made to /resolvers`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"))
      .attach("customerResolver", join(graphqlpath, "customerResolver.js"))
      .attach("productResolver", join(graphqlpath, "productResolver.js"));

    await agent
      .get("/api/v1/info/proj1/resolvers")
      .expect("Content-Type", /zip/)
      .expect("Content-Disposition", /resolvers\.zip/)
      .expect(200);
  });

  it(`Should return a message when a get request is made to /resolvers
      but no resolvers have been uploaded`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.js"));

    await agent
      .get("/api/v1/info/proj1/resolvers")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.message).toEqual(
          "No resolvers uploaded for project proj1"
        );
      })
      .expect(200);
  });

  it(`Should return an error when a get request is made to /resolvers
      but the project name specified doesn't exist`, async () => {
    await request(server.app)
      .get("/api/v1/info/proj1/resolvers")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.error).toEqual(
          "No project with name proj1 found in current session"
        );
      })
      .expect(400);
  });

  it(`Should return a zip file with the currently 
      uploaded dependency when a get request is made to /dependencies`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/dependencies")
      .attach("package", join(graphqlpath, "package.json"));

    await agent
      .get("/api/v1/info/proj1/dependencies")
      .expect("Content-Type", /zip/)
      .expect("Content-Disposition", /dependencies\.zip/)
      .expect(200);
  });

  it(`Should return a message when a get request is made to /dependencies
      but no dependency has been uploaded`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.js"));

    await agent
      .get("/api/v1/info/proj1/dependencies")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.message).toEqual(
          "No dependencies uploaded for project proj1"
        );
      })
      .expect(200);
  });

  it(`Should return an error when a get request is made to /dependencies
      but the project name specified doesn't exist`, async () => {
    await request(server.app)
      .get("/api/v1/info/proj1/dependencies")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.error).toEqual(
          "No project with name proj1 found in current session"
        );
      })
      .expect(400);
  });

  it(`Should return a zip file with the currently 
      uploaded schema when a get request is made to /schema`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.js"));

    await agent
      .get("/api/v1/info/proj1/schema")
      .expect("Content-Type", /zip/)
      .expect("Content-Disposition", /schema\.zip/)
      .expect(200);
  });

  it(`Should return a message when a get request is made to /schema
      but no schema has been uploaded`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolver", join(graphqlpath, "resolvers.js"));

    await agent
      .get("/api/v1/info/proj1/schema")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.message).toEqual(
          "No schema uploaded for project proj1"
        );
      })
      .expect(200);
  });

  it(`Should return an error when a get request is made to /schema
      but the project name specified doesn't exist`, async () => {
    await request(server.app)
      .get("/api/v1/info/proj1/schema")
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(res.body.error).toEqual(
          "No project with name proj1 found in current session"
        );
      })
      .expect(400);
  });
});
