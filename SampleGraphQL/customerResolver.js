const customerList = [
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

function customers() {
  return customerList;
}

module.exports = { customers };
