import loggerDev from "./config.dev.js";
import loggerProd from "./config.prod.js";
// import dotenv from "dotenv";
import { Command } from "commander";
const program = new Command()

let env = process.env.MODE
let logger = null;

switch (env) {
  case "dev":
    logger = loggerDev;
    break;
  case "prod":
    logger = loggerProd;
    break;
  default: //"PROD"
    logger = loggerProd;
    break;
}

export default logger;