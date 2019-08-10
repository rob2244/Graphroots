const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType
} = require("graphql");

const products = [
  {
    id: "a4cec6bb-7cd2-492b-98b9-593218c2fc8f",
    name: "Eggs",
    description: "Eggs",
    info: {
      price: 1.25,
      noInStock: 12
    }
  },
  {
    id: "580a1470-5d4e-4b75-97fe-cecb105cc3bd",
    name: "Butter",
    description: "Butter",
    info: {
      price: 3.5,
      noInStock: 3
    }
  },
  {
    id: "4fec9e4b-4018-4e6f-b983-3dd6df328606",
    name: "Vanilla Extract",
    description: "Vanilla Extract",
    info: {
      price: 12.75,
      noInStock: 30
    }
  },
  {
    id: "dd606613-a149-4715-b856-4f6c0882cfdb",
    name: "Orange Juice",
    description: "Orange Juice",
    info: {
      price: 15,
      noInStock: 50
    }
  },
  {
    id: "00b4dc3f-1d43-4602-97b7-29e3c415005c",
    name: "Bread",
    description: "Bread",
    info: {
      price: 8,
      noInStock: 134
    }
  },
  {
    id: "3eabc8c0-8da1-4cfd-a0b6-d9627c43584f",
    name: "Cheese",
    description: "Cheese",
    info: {
      price: 2.75,
      noInStock: 5
    }
  }
];

const customers = [
  {
    id: "e3fbbccb-7dae-4d88-89f9-5df99713a6ee",
    firstName: "Robin",
    lastName: "Seitz",
    address: "12345 dreary lane",
    email: "robinseitz@email.com"
  },
  {
    id: "705ff043-18d9-4e96-8fa8-fc62fcef340b",
    firstName: "Thomas",
    lastName: "Seitz",
    address: "12345 dreary lane",
    email: "thomasseitz@email.com"
  },
  {
    id: "91e08879-1fec-4c7d-b80d-b10b6b59263e",
    firstName: "Silvia",
    lastName: "Seitz",
    address: "12345 dreary lane",
    email: "silviaseitz@email.com"
  },
  {
    id: "1c592c74-57fd-4e74-a0ac-5979759feb49",
    firstName: "Dayna",
    lastName: "Seitz",
    address: "12345 dreary lane",
    email: "daynaseitz@email.com"
  }
];

const productIds = products.map(p => p.id);

const orders = [
  {
    id: "3f4375ec-494b-4aa7-8c24-1e3deba88458",
    totalPrice: 100,
    productIds: productIds.slice(0, 3),
    customerId: "e3fbbccb-7dae-4d88-89f9-5df99713a6ee"
  },
  {
    id: "65d3e61d-7ecc-4f23-96d4-b7581c3bc50f",
    totalPrice: 12.5,
    productIds: products.slice(2, 4),
    customerId: "e3fbbccb-7dae-4d88-89f9-5df99713a6ee"
  },
  {
    id: "07080efe-e78d-445b-98fd-902f82166ac8",
    totalPrice: 30.25,
    productIds: products.slice(0, 5),
    customerId: "705ff043-18d9-4e96-8fa8-fc62fcef340b"
  },
  {
    id: "a5efec0b-35dd-4ada-978e-95613a0564b2",
    totalPrice: 1000,
    productIds: products.slice(2, 4),
    customerId: "1c592c74-57fd-4e74-a0ac-5979759feb49"
  }
];

const customerType = new GraphQLObjectType({
  name: "Customer",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

const productInfoType = new GraphQLObjectType({
  name: "ProductInfo",
  fields: {
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    noInStock: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
});

const productType = new GraphQLObjectType({
  name: "Product",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    },
    info: {
      type: new GraphQLNonNull(productInfoType)
    }
  }
});

const orderType = new GraphQLObjectType({
  name: "Order",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(productType))
      ),
      resolve(parent) {
        return products.filter(p =>
          parent.productIds.some(pid => pid === p.id)
        );
      }
    },
    totalPrice: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    buyer: {
      type: new GraphQLNonNull(customerType),
      resolve(parent) {
        return customers.find(c => c.id === parent.customerId);
      }
    }
  }
});

const productInfoInputType = new GraphQLInputObjectType({
  name: "NewProductInfo",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    noInStock: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
});

const customerInputType = new GraphQLInputObjectType({
  name: "NewCustomer",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    customers: {
      type: new GraphQLList(customerType),
      resolve() {
        return customers;
      }
    },
    orders: {
      type: new GraphQLList(orderType),
      args: {
        customerId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { customerId }) {
        return orders.filter(o => o.customerId === customerId);
      }
    },
    products: {
      type: new GraphQLList(productType),
      resolve() {
        return products;
      }
    },
    productInfo: {
      type: new GraphQLNonNull(productInfoType),
      args: {
        productId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { productId }) {
        return products.find(p => p.productId === productId).info;
      }
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createProduct: {
      type: new GraphQLNonNull(productType),
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        info: { type: new GraphQLNonNull(productInfoInputType) }
      }
    },
    createCustomer: {
      type: new GraphQLNonNull(customerType),
      args: {
        customer: { type: new GraphQLNonNull(customerInputType) }
      }
    },
    createOrder: {
      type: new GraphQLNonNull(orderType),
      args: {
        products: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(GraphQLID))
          )
        },
        totalPrice: { type: new GraphQLNonNull(GraphQLFloat) },
        customerId: { type: new GraphQLNonNull(GraphQLID) }
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports = schema;
