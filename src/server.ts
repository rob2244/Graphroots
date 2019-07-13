import * as bodyParser from "body-parser";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { UserController } from "./controllers/userController";
import session from "express-session";
import store from "connect-redis";
import fileUpload from 'express-fileupload'

class GraphrootsServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === "development");
    this.setupMiddleware();
    this.setupControllers();
  }

  private setupMiddleware() {
    const RedisStore = store(session);
    this.app.use(
      session({
        store: new RedisStore({
          host: "redis"
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
      })
    );

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 }
    }))
  }

  private setupControllers(): void {
    const userController = new UserController();
    super.addControllers([userController]);
  }

  start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp(`Server listening on port: ${port}`);
    });
  }
}

export default GraphrootsServer;
