import express from "express";
import createApolloGraphqlServer from "./graphql/index"; // exporting the graphql server
import { expressMiddleware } from "@apollo/server/express4";

async function startServer() {
  try {
    // Initialize Express
    const app = express();
    const PORT = Number(process.env.PORT) || 80;

    // Middlewares
    // If any response comes in the form of JSON, use bodyParser
    app.use(express.json());

    // Exposing the GraphQL server
    const graphqlServer = await createApolloGraphqlServer();
    app.use("/graphql", express.json(), expressMiddleware(graphqlServer));

    // Route 
    app.get("/", (req, res) => {
      res.json({ message: "server is up and running" });
    });

    // Start the app
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Call the startServer function
startServer();
