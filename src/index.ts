import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import { buildSchema } from "type-graphql";
import get from "lodash.get";

import { UserResolver } from "./user";
import { ForumResolver } from "./forum";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, ForumResolver],
    emitSchemaFile: false,
    validate: false,
  });
  const server: ApolloServer = new ApolloServer({ schema });

  connect(`mongodb://localhost:27017/`, { dbName: "forum" })
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
