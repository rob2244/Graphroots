const express = require("express");
const resolvers = require("./resolvers");
const customerResolver = require("./customerResolver");
const productResolver = require("./productResolver");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema.js");
const { buildSchema } = require("graphql");
const fs = require("fs");

const app = express();
//const schema = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });
const port = process.env.PORT || 4000;

app.use(
  "/graphql",
  graphqlHTTP({
    //schema: buildSchema(schema),
    schema,
    rootValue: {
      ...resolvers,
      ...customerResolver,
      ...productResolver
    }
  })
);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Running a GraphQL API server on port ${port}`);
});
