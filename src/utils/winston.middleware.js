import configDev from "../config/loggers/config.dev.js";

export default (error, req, res, next) => {
  req.logger = configDev;
  req.logger.HTTP(
    `${req.method} ${req.url} - ${new Date().toLocaleDateString()}`
  );
  return next();
};
