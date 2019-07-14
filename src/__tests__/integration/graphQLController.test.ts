import request from "supertest";
import GraphrootsServer from "../../server";
import { resolve, join } from "path";

describe("GraphQLController Integration Tests", () => {
  let server: GraphrootsServer;
  const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");

  beforeAll(() => {
    server = new GraphrootsServer();
  });

  it(`should return a bad request when no resolver file is uploaded`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/resolvers")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res =>
        expect(res.body.errors).toBe("resolvers file required but not found")
      )
      .expect(400);
  });

  it(`Should successfully save a resolvers file 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should return an error when a file
      with an invalid extension is posted to /resolvers`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/resolvers")
      .attach("resolvers", join(graphqlpath, "schema.graphql"))
      .set("Accept", "application/json")
      .expect(res =>
        expect(res.body.errors).toBe(
          "Invalid file extension, only files with the following extensions accepted: .js"
        )
      )
      .expect(400);
  });

  it(`should return a bad request when no schema file is uploaded`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/schema")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res =>
        expect(res.body.errors).toBe("schema file required but not found")
      )
      .expect(400);
  });

  it(`Should successfully save a schema file 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/schema")
      .attach("schema", join(graphqlpath, "schema.graphql"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should return an error when a file
  with an invalid extension is posted to /schema`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/schema")
      .attach("schema", join(graphqlpath, "resolvers.js"))
      .set("Accept", "application/json")
      .expect(res =>
        expect(res.body.errors).toBe(
          "Invalid file extension, only files with the following extensions accepted: .graphql"
        )
      )
      .expect(400);
  });
});
