import config from "../config/loggers/factory.js";

export default (error, req, res, next) => {
  req.logger = config;
  req.logger.FATAL(
    `${req.method} ${req.url} - ${
      error.message
    } - ${new Date().toLocaleTimeString()}`
  );
  return res.status(error.statusCode).json({
    message: error.message,
    response: false,
  });
};