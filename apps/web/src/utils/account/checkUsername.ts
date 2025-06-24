import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";

export const checkUsername = async (username: string): Promise<boolean> => {
  const QUERY = gql`
    query MyQuery($username: String!) {
      checkUsername(username: $username)
    }
  `;

  try {
    const { data } = await client.query({
      query: QUERY,
      variables: { username },
    });

    return !data.checkUsername;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};
