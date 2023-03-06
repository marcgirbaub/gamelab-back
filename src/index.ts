import "./loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

const debug = createDebug("gamelab:*");

const port = process.env.PORT ?? 4000;
const mongoDdUrl = process.env.MONGODB_CONNECTION_URL;

try {
  await connectDatabase(mongoDdUrl!);
  debug(chalk.green("Connected to database"));

  await startServer(Number(port));
  debug(chalk.green(`Server listening on port ${port}`));
} catch (error) {
  debug(chalk.red(error.message));
}
