import express from "express";
import createApolloGraphqlServer from "./graphql/index"; // exporting the graphql server
import { expressMiddleware } from "@apollo/server/express4";
import { stripIgnoredCharacters } from "graphql";
import userService from "./services/user";

async function startServer() {
  try {
    // Initialize Express
    const app = express();
    const PORT = Number(process.env.PORT) || 80;

    // Middlewares
    // If any response comes in the form of JSON, use bodyParser
    app.use(express.json());

    // Exposing the GraphQL serve

    app.use(
      "/graphql",
      expressMiddleware(await createApolloGraphqlServer(), {
        context: async ({ req }) => {
          //@ts-ignore
          const token = req.headers["token"] //passing the token as header
      
          try {
            const user = userService.decodeJWTToken(token as string);
            return { user };
          } catch (error) {
            return {};
          }
        },
      })
    );

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
