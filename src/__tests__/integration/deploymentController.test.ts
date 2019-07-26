import GraphrootsServer from "../../server";
import { resolve, join } from "path";
import request from "supertest";
import DeployerType from "../../deployer/deployerType";

describe("Deployment controller integration tests", () => {
  let server: GraphrootsServer;
  const graphqlpath = resolve(__dirname, "../../../SampleGraphQL");
  const payload = {
    clientId: "209eaf40-3bad-46b4-a159-e9cd955b1dfb",
    clientSecret: "9d1b2d05-ad32-412a-a1ec-bdf3b561f908",
    tenantId: "bff5d0b8-c751-4d75-b8ce-fd420452e0e8",
    subscriptionId: "dc783225-30bc-4727-bf07-13b1f6ef10bb",
    location: "us west",
    resourceGroupName: "graphroots",
    webAppName: "graphroots",
    cloudType: DeployerType.Azure
  };

  beforeAll(() => {
    server = new GraphrootsServer();
  });

  it("should return an error if no graphql schema is set in the current session", async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"));

    await agent
      .post("/api/v1/deployment/proj1")
      .send(payload)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res =>
        expect(res.body.error).toBe(
          "No graphql schema found in current session"
        )
      )
      .expect(400);
  });

  it("should return an error if no project exists in session storage", async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/deployment/proj1")
      .send(payload)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res =>
        expect(res.body.error).toBe(
          "No project with name proj1 found in current session"
        )
      )
      .expect(400);
  });

  it("should return an error if no resolvers are set in the current session", async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.graphql"));

    await agent
      .post("/api/v1/deployment/proj1")
      .send(payload)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res =>
        expect(res.body.error).toBe(
          "No graphql resolvers found in current session"
        )
      )
      .expect(400);
  });

  it("should return an error if the correct data isn't sent in the request body", async () => {
    await request(server.app)
      .post("/api/v1/deployment/proj1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => expect(res.body.errors).toMatchSnapshot())
      .expect(400);
  });

  it("should sucessfully zip and deploy resources", async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.graphql"));

    await agent
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"));

    await agent
      .post("/api/v1/deployment/proj1")
      .send(payload)
      .set("Accept", "application/json")
      .expect(201);
  });

  it(`should sucessfully zip and deploy resources with an added 
      package.json and multiple resolvers`, async () => {
    const agent = request.agent(server.app);

    await agent
      .post("/api/v1/graphql/proj1/schema")
      .attach("schema", join(graphqlpath, "schema.graphql"));

    await agent
      .post("/api/v1/graphql/proj1/resolvers")
      .attach("resolvers", join(graphqlpath, "resolvers.js"))
      .attach("productResolver", join(graphqlpath, "productResolver.js"))
      .attach("customerResolver", join(graphqlpath, "customerResolver.js"));

    await agent
      .post("/api/v1/graphql/proj1/dependencies")
      .attach("package", join(graphqlpath, "package.json"));

    await agent
      .post("/api/v1/deployment/proj1")
      .send(payload)
      .set("Accept", "application/json")
      .expect(201);
  });
});
