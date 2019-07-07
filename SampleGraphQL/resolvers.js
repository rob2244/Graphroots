const custs = [
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

class Order {
  constructor(id, totalPrice, products, customerId) {
    this.id = id;
    this.totalPrice = totalPrice;
    (this.products = products), (this.customerId = customerId);
  }

  buyer() {
    return custs.find(c => c.id === this.customerId);
  }
}

const orders = [
  new Order(
    "3f4375ec-494b-4aa7-8c24-1e3deba88458",
    100,
    products.slice(0, 3),
    "e3fbbccb-7dae-4d88-89f9-5df99713a6ee"
  ),
  new Order(
    "65d3e61d-7ecc-4f23-96d4-b7581c3bc50f",
    12.5,
    products.slice(2, 4),
    "e3fbbccb-7dae-4d88-89f9-5df99713a6ee"
  ),
  new Order(
    "07080efe-e78d-445b-98fd-902f82166ac8",
    30.25,
    products.slice(0, 5),
    "705ff043-18d9-4e96-8fa8-fc62fcef340b"
  ),
  new Order(
    "a5efec0b-35dd-4ada-978e-95613a0564b2",
    1000,
    products.slice(2, 4),
    "1c592c74-57fd-4e74-a0ac-5979759feb49"
  )
];

const resolvers = {
  customers() {
    return custs;
  },
  orders({ customerId }) {
    return orders.filter(o => o.customerId === customerId);
  },
  products() {
    return products;
  },
  productInfo() {}
};

module.exports = resolvers;
