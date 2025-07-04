import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";


const apiURl = process.env.NEXT_PUBLIC_API_URL;

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: `${apiURl}/graphql/`, // Change to your Django GraphQL URL
//     fetchOptions: { cache: "no-store" }, // Ensures fresh data
//     credentials: "include", // Send cookies
//   }),
//   cache: new InMemoryCache(),
// });

const client = new ApolloClient({
  link: createUploadLink({
    uri: `${apiURl}/graphql/`, // Change to your Django GraphQL URL
    fetchOptions: { cache: "no-store" }, // Ensures fresh data
    credentials: "include", // Send cookies
  }),
  cache: new InMemoryCache(),
});

export default client;
