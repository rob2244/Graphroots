import Server from "./server";
import dotenv from "dotenv";
import { existsSync } from "fs";

const containerSecretPath = "/run/secrets/.env";
const envPath = existsSync(containerSecretPath) ? containerSecretPath : null;

dotenv.config({ path: envPath });

const server = new Server();

const port = process.env.PORT || "4000";

server.start(parseInt(port));
