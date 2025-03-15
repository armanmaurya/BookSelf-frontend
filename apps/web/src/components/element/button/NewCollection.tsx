"use client";

import client from "@/lib/apolloClient";
import { GraphQLData } from "@/types/graphql";
import { gql } from "@apollo/client";
import { useState } from "react";

export const NewCollectionButton = () => {
  
  const [showModal, setShowModal] = useState(false);

  const createCollection = async ({
    name,
    isPublic,
  }: {
    name: string;
    isPublic: boolean;
  }) => {
    const { data } = await client.mutate({
      mutation: MUTATION,
      variables: {
        name,
        isPublic,
      },
    });
  };
  return (
    <div>
      (
         <div
         className="bg-neutral-800 h-96 w-96 rounded-md flex justify-center items-center flex-col space-y-6"
       >
         <input
           type="text"
           className=" p-2 bg-transparent border rounded-md"
           placeholder="Name"
         />
         <div>
           <input type="checkbox" />
           <span>Public</span>
         </div>
         <div className="flex space-x-2">
           <button
             className=" border p-1 rounded-md"
             onClick={() => {
             }}
           >
             Cancel
           </button>
           <button className="bg-blue-500 p-1 rounded-md">Create</button>
         </div>
       </div>
      )}
    </div>
  );
};
