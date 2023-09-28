import dotenv from "dotenv";

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_KEY: process.env.GITHUB_KEY
}