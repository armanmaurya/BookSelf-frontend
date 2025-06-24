"use server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";

export async function updateProfileAction(formData: FormData) {
  const firstName = formData.get("firstName")?.toString().trim() || "";
  const lastName = formData.get("lastName")?.toString().trim() || "";
  const about = formData.get("about")?.toString().trim() || "";

  if (!firstName || !lastName) {
    throw new Error("First and last name are required.");
  }

  const MUTATION = gql`
    mutation UpdateProfile($firstName: String!, $lastName: String!, $about: String) {
      updateProfile(firstName: $firstName, lastName: $lastName, about: $about) {
        firstName
        lastName
        about
      }
    }
  `;

  const client = createServerClient();
  const { data, errors } = await client.mutate({
    mutation: MUTATION,
    variables: { firstName, lastName, about },
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  revalidatePath("/settings/profile");
  return data?.updateProfile;
}
