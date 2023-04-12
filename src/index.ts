import "reflect-metadata";

import populate from "mongoose-autopopulate";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Types, connect } from "mongoose";
import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
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
class Author {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop()
  name: string;
}
const AuthorModel = getModelForClass(Author);
@Resolver(Author)
class AuthorResolver {
  @Query(() => [Book])
  async books(@Arg("id", { nullable: false }) id: string) {
    return AuthorModel.findOne({ _id: id });
  }

  @Mutation(() => Book)
  async register(@Arg("name", { nullable: false }) name: string) {
    return AuthorModel.create({ name, books: [] });
  }
}

@ObjectType()
@plugin(populate)
class Book {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop()
  title: string;

  @Field(() => Author)
  @prop({ ref: Author, required: true, autopopulate: true })
  author: Ref<Author>;
}
const BookModel = getModelForClass(Book);
@Resolver(Book)
class BookResolver {
  @Query(() => [Book])
  async books() {
    return BookModel.find();
  }

  @Mutation(() => Book)
  async book(
    @Arg("title", { nullable: false }) title: string,
    @Arg("author", { nullable: false }) authorID: string
  ) {
    const author: Author = await AuthorModel.findOne({
      _id: new Types.ObjectId(authorID),
    });
    return BookModel.create({
      title,
      author,
    });
  }
}

const schema = await buildSchema({
  resolvers: [BookResolver, AuthorResolver],
  emitSchemaFile: false,
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
