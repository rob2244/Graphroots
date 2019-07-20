import Server from "./server";
import dotenv from "dotenv";

const containerSecretPath = "/run/secrets/.env";

dotenv.config({ path: containerSecretPath });
const server = new Server();

const port = process.env.PORT || "4000";

server.start(parseInt(port));
