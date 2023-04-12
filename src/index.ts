import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as mongoose from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose";
import {
  Arg,
  ObjectType,
  Mutation,
  Field,
  Resolver,
  Query,
  buildSchema,
  ID,
} from "type-graphql";
import get from "lodash.get";

@ObjectType()
export class Book {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop()
  title: string;

  @Field()
  @prop()
  author: string;
}

export const BookModel = getModelForClass(Book);
export interface Book {
  _id: string;
  title: string;
  author: string;
}

@Resolver(Book)
class BookResolver {
  @Query(() => [Book])
  async books() {
    return BookModel.find();
  }

  @Mutation(() => Book)
  async book(
    @Arg("title", { nullable: false }) title: string,
    @Arg("author", { nullable: false }) author: string
  ) {
    return BookModel.create({ title, author });
  }
}

const schema = await buildSchema({
  resolvers: [BookResolver],
  emitSchemaFile: false,
});
const server: ApolloServer = new ApolloServer({ schema });

mongoose
  .connect(`mongodb://localhost:27017/`, { dbName: "guides" })
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
