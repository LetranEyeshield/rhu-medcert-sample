import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export { yoga as GET, yoga as POST };