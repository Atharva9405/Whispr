import app from "./app.js";
import logger from "./configs/logger.config.js";
import mongoose from "mongoose";

const { MONGO_DB } = process.env;
const PORT = process.env.PORT || 8000;

mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error : ${err}`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

mongoose
  .connect(MONGO_DB, {
    useNewUrlParser: true,
    useunifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  });

let server;

server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
