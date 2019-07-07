const express = require("express");
const app = express();
const schema = require("./schema");
const resolvers = require("./resolvers");
const graphqlHTTP = require("express-graphql");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers
  })
);

app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});
