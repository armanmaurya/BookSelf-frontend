import { EditableProfilePicture } from "@/components/blocks/EditProfilePicture";
import { ProfileForm } from "./form";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
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
      </div>

      {/* Main Form Sections */}
      <ProfileForm
        defaultFirstName={data?.me?.firstName || ""}
        defaultLastName={data?.me?.lastName || ""}
        defaultAbout={data?.me?.about || ""}
      />
    </div>
  );
};

export default Page;
