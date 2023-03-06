import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import startServer from "./server/startServer.js";

const debug = createDebug("gamelab:*");

const port = process.env.PORT ?? 4000;

try {
  await startServer(Number(port));
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(error.message);
}
