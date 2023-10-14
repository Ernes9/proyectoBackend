import { createLogger, format, transports, addColors } from "winston";

const { simple } = format;

const levels = {
  FATAL: 1,
  WARN: 2,
  INFO: 3,
  HTTP: 4,
};

export default createLogger({
    levels,
    transports: [
        new transports.Console({
            level: "HTTP",
            format: simple()
        }),
        new transports.File({
            level: "WARN",
            format: simple(),
            filename: "./errors.log"
        })
    ]
})