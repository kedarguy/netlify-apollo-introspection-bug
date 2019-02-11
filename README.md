# Netlify Functions Apollo-Server bug with introspection example

Clone this repo

run:

yarn

yarn build:server

yarn start:server

go to localhost:9000/graphql

see error in console and that schema only includes the local schema

run yarn start:node-gql (this runs "node src/graphql-node)

go to localhost:4000

see that the schema includes both remote and local schema
