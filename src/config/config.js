import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command()

program.option('--mode <mode>','mode of execution','dev')
program.parse()
const options = program.opts()
dotenv.config({
    path: options.mode=='prod' ? './.env.prod' :'./.env.dev',
});

export default {
    persistence: process.env.PERSISTENCE,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_KEY: process.env.GITHUB_KEY
}