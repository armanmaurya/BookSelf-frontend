import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";
const apiURl = process.env.NEXT_PUBLIC_API_URL;

export const createServerClient = () => {
  const cookieStore = cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const sessionid = cookieStore.get("sessionid")?.value;

  return new ApolloClient({
    link: new HttpLink({
      uri: `${apiURl}/graphql/`, // Change to your Django GraphQL URL
      fetchOptions: { cache: "no-store" }, // Ensures fresh data
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Cookie: `sessionid=${sessionid}; csrftoken=${csrftoken}`,
      },
    }),
    cache: new InMemoryCache(),
  });
};

