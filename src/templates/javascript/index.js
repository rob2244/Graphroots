const express = require("express");
const resolvers = require("./resolvers");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");

const app = express();
const schema = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: resolvers
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Running a GraphQL API server on port ${port}`);
});
