import "reflect-metadata";
import { config } from "dotenv";
import * as path from "path";

console.log("env: ", process.env.NODE_ENV);

config({
  path: path.join(
    __dirname,
    "..",
    process.env.NODE_ENV == "production" ? ".env" : ".env.development"
  ),
});

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import get from "lodash.get";
import winston from "winston";

import { UserResolver } from "./user";
import { ForumResolver } from "./forum";
import { PostResolver } from "./post";
import { ThreadResolver } from "./thread";

const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, ForumResolver, PostResolver, ThreadResolver],
    emitSchemaFile: false,
    validate: false,
  });

  const server: ApolloServer = new ApolloServer({
    schema,
  });

  connect(
    process.env.NODE_ENV == "production"
      ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.r7uptes.mongodb.net/?retryWrites=true&w=majority`
      : `mongodb://127.0.0.1:27017/sif?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
    { dbName: "reddit4" }
  )
    .then(
      (): Promise<{ url: string }> =>
        startStandaloneServer(server, { listen: { port: 4000 } })
    )
    .then(({ url }: { url: string }) =>
      console.log(`🚀  Server ready at: ${url}`)
    )
    .catch((err: Error) => {
      console.error(get(err, "message", "Something went wrong."));
    });
};

main();
