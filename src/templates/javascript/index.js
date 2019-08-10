const express = require("express");
{{#resolvers}}
const {{trimExt}} = require("./{{trimExt}}")
{{/resolvers}}
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
{{^isGQLSchemaLanguage}}
const schema = require('./schema')
{{/isGQLSchemaLanguage}}
const fs = require("fs");

const app = express();

{{#isGQLSchemaLanguage}}
const schema = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });
{{/isGQLSchemaLanguage}}

app.use(
  "/graphql",
  graphqlHTTP({
    {{#isGQLSchemaLanguage}}
    schema: buildSchema(schema),
    {{/isGQLSchemaLanguage}}
    {{^isGQLSchemaLanguage}}
    schema,
    {{/isGQLSchemaLanguage}}
    rootValue: {
      {{#resolvers}}
      ...{{trimExt}},
      {{/resolvers}}
    }   
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Running a GraphQL API server on port ${port}`);
});
