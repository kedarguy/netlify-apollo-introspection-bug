const {
  ApolloServer,
  gql,
  introspectSchema,
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require("apollo-server-lambda");

const { createHttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world 8!"
  }
};

const localSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const createRemoteSchema = async () => {
  const remoteSchemaLink = createHttpLink({
    uri: `https://api-uswest.graphcms.com/v1/cjs0xy18i740h01f96jatko7r/master`,
    fetch
  });

  const schema = await introspectSchema(remoteSchemaLink);

  return makeRemoteExecutableSchema({
    schema,
    link: remoteSchemaLink
  });
};

const runHandler = (event, context, handler) =>
  new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));

    handler(event, context, callback);
  });

const run = async (event, context) => {
  // Create your connections here
  const schemaArr = [localSchema];

  try {
    const remoteSchema = await createRemoteSchema();
    schemaArr.push(remoteSchema);
    console.log("sucess with remote");
  } catch (err) {
    console.log("failed with remote schema", err);
  }
  const schemas = mergeSchemas({
    schemas: schemaArr
  });
  const server = new ApolloServer({
    schema: schemas,
    introspection: true,
    playground: true
  });
  const handler = server.createHandler({
    cors: {
      origin: "*",
      credentials: true,
      allowedHeaders: ["ContentType", "content-type", "Origin", "Accept"]
    }
  });
  const response = await runHandler(event, context, handler);

  return response;
};

exports.handler = run;
