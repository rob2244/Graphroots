process.env.SESSION_SECRET = "09def08c-991e-48bb-91b4-fa8366836df1";

module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
