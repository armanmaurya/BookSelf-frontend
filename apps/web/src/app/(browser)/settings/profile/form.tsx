"use client";
import { TextInput } from "@/components/element/inputs/textInput";
import { gql } from "@apollo/client";
import { createServerClient } from "@/lib/ServerClient";
import React, { useRef, useState } from "react";
import client from "@/lib/apolloClient";

export function ProfileForm({ defaultFirstName, defaultLastName, defaultAbout }: {
  defaultFirstName: string;
  defaultLastName: string;
  defaultAbout: string;
}) {
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName")?.toString().trim() || "";
    const lastName = formData.get("lastName")?.toString().trim() || "";
    const about = formData.get("about")?.toString().trim() || "";

    if (!firstName || !lastName) {
      alert("First and last name are required.");
      return;
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

    try {
      const { data, errors } = await client.mutate({
        mutation: MUTATION,
        variables: { firstName, lastName, about },
      });
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to update profile.");
      setSuccess(false);
    }
  }

  return (
    <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>
      {success && (
        <div className="mb-4 text-green-500 bg-green-900/30 border border-green-700 rounded p-2 text-center relative animate-fade-in">
          Profile updated!
          <button
            type="button"
            aria-label="Close"
            className="absolute top-1 right-2 text-green-300 hover:text-green-100 text-lg font-bold"
            onClick={() => setSuccess(false)}
          >
            ×
          </button>
        </div>
      )}
      {/* Name Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Name</h2>
        <div className="flex space-x-4">
          <div className="flex-1 bg-neutral-700 rounded-md border border-neutral-600">
            <TextInput
              placeholder="First name"
              name="firstName"
              defaultValue={defaultFirstName}
            />
          </div>
          <div className="flex-1 bg-neutral-700 rounded-md border border-neutral-600">
            <TextInput
              placeholder="Last name"
              name="lastName"
              defaultValue={defaultLastName}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">About</h2>
        <div className="bg-neutral-700 rounded-md border border-neutral-600">
          <textarea
            name="about"
            placeholder="Tell us a little bit about yourself"
            className="w-full bg-transparent p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md min-h-[100px]"
            defaultValue={defaultAbout}
          />
        </div>
        <p className="text-neutral-400 text-sm"></p>
      </section>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md shadow"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
