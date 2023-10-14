import { createLogger, format, transports, addColors } from "winston";

const { simple, colorize } = format;

const levels = {
  FATAL: 1,
  WARN: 2,
  INFO: 3,
  HTTP: 4,
};

const colors = {
  FATAL: "red",
  WARN: "yellow",
  INFO: "white",
  HTTP: "blue",
};

addColors(colors);

export default createLogger({
    levels,
    format: colorize(),
    transports: [
        new transports.Console({
            level: "HTTP",
            format: simple()
        })
    ]
})