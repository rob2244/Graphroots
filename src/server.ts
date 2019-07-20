import * as bodyParser from "body-parser";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import session, { MemoryStore } from "express-session";
import store from "connect-redis";
import fileUpload from "express-fileupload";
import DeploymentController from "./controllers/deploymentController";
import GraphQLController from "./controllers/graphQLController";
import createDeployer from "./deployer/deployerFactory";
import JavascriptGenerator from "./generator/javascriptGenerator";
import { Application } from "express";

class GraphrootsServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === "development");
    this.setupMiddleware();
    this.setupControllers();
  }

  // Exposed for testing using super test
  get app(): Application {
    return super.app;
  }

  private setupMiddleware() {
    const RedisStore = store(session);

    this.app.use(
      session({
        store:
          process.env.NODE_ENV === "test"
            ? new MemoryStore()
            : new RedisStore({
                host: "redis"
              }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
      })
    );

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }
      })
    );

    this.app.get("/", (req, res) => {
      res.send("<h1>Hello World</h1>");
    });
  }

  private setupControllers(): void {
    const deployerFactory =
      process.env.NODE_ENV === "test"
        ? () => ({
            deployResources: () => Promise.resolve(),
            deployApplication: () => Promise.resolve()
          })
        : createDeployer;

    const deployment = new DeploymentController(
      deployerFactory,
      new JavascriptGenerator()
    );

    const graphQL = new GraphQLController();
    super.addControllers([deployment, graphQL]);
  }

  start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp(`Server listening on port: ${port}`);
    });
  }
}

export default GraphrootsServer;
