import "../loadEnvironment.js";
import createDebug from "debug";
import { app } from "./index.js";

const debug = createDebug("social:server:startServer");

const startServer = async (port: number) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });

export default startServer;
