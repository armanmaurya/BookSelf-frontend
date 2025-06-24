import { EditableProfilePicture } from "@/components/blocks/EditProfilePicture";
import { UsernameInput } from "@/components/blocks/inputs/usernameInput";
import { TextInput } from "@/components/element/inputs/textInput";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { create } from "domain";
import React from "react";

const Page = async () => {
  const QUERY = gql`
    query MyQuery {
      me {
        about
        lastName
        firstName
        profilePicture
      }
    }
  `;
  const { data } = await createServerClient().query({
    query: QUERY,
  });
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Public profile</h1>

      {/* Profile Picture Section at Top */}
      <div className="flex flex-col items-center space-y-3 mb-6">
        <EditableProfilePicture src={data.me.profilePicture} />
        {/* <div className="w-32 h-32 rounded-full bg-neutral-700 overflow-hidden border border-neutral-600">
          <img
            src={data?.me?.profilePicture || "https://avatars.githubusercontent.com/u/583231?v=4"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          type="button"
        >
          Edit
        </button> */}
      </div>

      {/* Main Form Sections */}
      <form className="space-y-6" action={"/api/profile/update"} method="post">
        {/* Name Section */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Name</h2>
          <div className="flex space-x-4">
            <div className="flex-1 bg-neutral-700 rounded-md border border-neutral-600">
              <TextInput
                placeholder="First name"
                name="firstName"
                defaultValue={data?.me?.firstName || ""}
              />
            </div>
            <div className="flex-1 bg-neutral-700 rounded-md border border-neutral-600">
              <TextInput
                placeholder="Last name"
                name="lastName"
                defaultValue={data?.me?.lastName || ""}
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
              defaultValue={data?.me?.about || ""}
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
    </div>
  );
};

export default Page;
