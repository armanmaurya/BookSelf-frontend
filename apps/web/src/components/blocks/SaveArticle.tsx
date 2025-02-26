"use client";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { NewCollectionButton } from "../element/button/NewCollection";

export const SaveArticle = ({
  initialIsSaved,
  articleSlug,
}: {
  initialIsSaved: boolean;
  articleSlug: string;
}) => {
  const [show, setShow] = useState(false);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [isArticleCreateOpen, setIsArticleCreateOpen] = useState(false);
  const [collectionData, setCollectonData] = useState({
    name: "",
    isPublic: false,
  });

  const showModal = () => {
    setShow(true);
  };
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShow(false);
      setIsArticleCreateOpen(false);
    }
  };


  const createCollection = async () => {
    const { data } = await client.mutate({
      mutation: MUTATION,
      variables: {
        name: collectionData.name,
        isPublic: collectionData.isPublic,
      },
    });
    if (data) {
        setIsArticleCreateOpen(false);
        setCollections([data.createCollection, ...collections]);

    }
  };
  const GET_USER_COLLECTIONS = gql`
    query MyQuery($username: String!) {
      user(username: $username) {
        collections(number: 10) {
          id
          name
        }
      }
    }
  `;

  const MUTATION = gql`
    mutation MyMutation($name: String!, $isPublic: Boolean!) {
      createCollection(name: $name, isPublic: $isPublic) {
        id
        name
      }
    }
  `;

  const fetchCollections = async () => {
    client
      .query({
        query: GET_USER_COLLECTIONS,
        variables: {
          username: user?.username,
        },
      })
      .then((res) => {
        console.log(res.data.user.collections);
        setCollections(res.data.user.collections);
      });
  };

  useEffect(() => {
    fetchCollections();

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <div className="hover:cursor-pointer" onClick={showModal}>
        <FaRegBookmark />
      </div>
      {show && (
        <div className=" rounded-md fixed top-0 left-0 backdrop-blur-sm bg-black bg-opacity-50 w-full h-full flex justify-center items-center">
          {isArticleCreateOpen ? (
            <div
              className="bg-neutral-800 h-96 w-96 rounded-md flex justify-center items-center flex-col space-y-6"
              ref={ref}
            >
              <input
                type="text"
                value={collectionData.name}
                onChange={(e) => {
                    setCollectonData({ ...collectionData, name: e.target.value });
                }}
                className=" p-2 bg-transparent border rounded-md"
                placeholder="Name"
              />
              <div>
                <input type="checkbox" onChange={(e) => {
                    setCollectonData({ ...collectionData, isPublic: e.target.checked });
                }} checked={collectionData.isPublic} />
                <span>Public</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className=" border p-1 rounded-md"
                  onClick={() => {
                    setIsArticleCreateOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button className="bg-blue-500 p-1 rounded-md" onClick={createCollection}>Create</button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-800 p-4 rounded-md space-y-2 flex flex-col" ref={ref}>
              {collections.map((collection) => {
                return <div>{collection.name}</div>;
              })}
              <button
                onClick={() => {
                  setIsArticleCreateOpen(true);
                }}
                className="bg-blue-500 rounded-md p-2"
              >
                New Collection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
