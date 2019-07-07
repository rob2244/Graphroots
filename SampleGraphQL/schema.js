var { buildSchema } = require("graphql");

const schema = `type Product {
    id: ID!
    name: String!
    description: String
    info: ProductInfo!
}

input NewProductInfo {
    id: ID!
    price: Float!
    noInStock: String!
}

type ProductInfo {
    price: Float!
    noInStock: Int!
}

type Order {
    id: ID!
    products: [Product!]!
    totalPrice: Float!
    buyer: Customer!
}

type Customer {
    id: ID!
    firstName: String!
    lastName: String!
    address: String!
    email: String!
}

input NewCustomer {
    id: ID!
    firstName: String!
    lastName: String!
    address: String!
    email: String!
}

type Query {
    customers: [Customer]
    orders(customerId: ID!): [Order]
    products: [Product]
    productInfo(productId: ID!): ProductInfo!
}

type Mutation {
    createProduct(name: String!, description: String!, info: NewProductInfo!): Product!
    createCustomer(customer: NewCustomer!): Customer!
    createOrder(products: [ID!]!, totalPrice: Float!, customerId: ID!): Order!
}`;

module.exports = buildSchema(schema);
