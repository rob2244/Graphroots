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
      .post("/api/v1/graphql/proj1/resolvers")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => expect(res.body.errors).toBe("No files uploaded"))
      .expect(400);
  });

  it(`Should successfully save a resolvers file 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should successfully save multiple resolver files 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"))
      .attach("customerResolver", join(graphqlpath, "customerResolver.js"))
      .attach("productResolver", join(graphqlpath, "productResolver.js"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should return an error when a file
      with an invalid extension is posted to /resolvers`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/resolvers")
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
      .post("/api/v1/graphql/proj1/schema")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => expect(res.body.errors).toBe("No files uploaded"))
      .expect(400);
  });

  it(`Should successfully save a schema file in grpahql sdl notation 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.graphql"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should successfully save a schema file in graphql object notation
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.js"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should return an error when a file
      with an invalid extension is posted to /schema`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "package.json"))
      .set("Accept", "application/json")
      .expect(res =>
        expect(res.body.errors).toBe(
          "Invalid file extension, only files with the following extensions accepted: .graphql, .js"
        )
      )
      .expect(400);
  });

  it(`Should successfully save a package.json file 
      to the session when one is posted`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/dependencies")
      .attach("package", join(graphqlpath, "package.json"))
      .set("Accept", "application/json")
      .expect(200);
  });

  it(`Should return an error when a file
      with an invalid extension is posted to /dependencies`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/dependencies")
      .attach("package", join(graphqlpath, "resolvers.js"))
      .set("Accept", "application/json")
      .expect(res =>
        expect(res.body.errors).toBe(
          "Invalid file extension, only files with the following extensions accepted: .json"
        )
      )
      .expect(400);
  });

  it(`Should return an error when a file
      with an invalid name is posted to /dependencies`, async () => {
    await request(server.app)
      .post("/api/v1/graphql/proj1/dependencies")
      .attach("resolver", join(graphqlpath, "package.json"))
      .set("Accept", "application/json")
      .expect(res =>
        expect(res.body.errors).toBe(
          "Expected the following files: package, but they were not found"
        )
      )
      .expect(400);
  });
});
