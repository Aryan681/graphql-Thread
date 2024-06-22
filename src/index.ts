import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function Server() {

//initialize express //
const app = express();
const PORT = Number(process.env.PORT) || 80;

//Middlewares

//if any response come in the form of json the use bodyParser
app.use(express.json());

//creating Graphql server
const gqlServer = new ApolloServer({
  typeDefs: ``, //schema (database)
  resolvers: {},
});

//start gql server
await gqlServer.start();

//exposing the gqlServer 
app.use('/graphql', express.json(), expressMiddleware(gqlServer));

//route
app.get("/", (req, res) => {
  res.json({ message: "server is up and running" });
});
//start app
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

}

//call the server function 
Server();