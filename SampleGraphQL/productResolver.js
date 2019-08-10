const productList = [
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

function products() {
  return productList;
}

module.exports = { products };
