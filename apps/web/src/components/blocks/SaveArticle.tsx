"use client";
import { useAuth } from "@/context/AuthContext";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { AddArticleToCollection } from "../element/button/AddArticleToCollection";
import { LoadingSpinner } from "../element/loadingSpinner";
import { CollectionType } from "@/types/Collection";

export const SaveArticle = ({
  articleSlug,
  setShow,
}: {
  setShow: (show: boolean) => void;
  articleSlug: string;
}) => {
  const [collections, setCollections] = useState<
    CollectionType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isArticleCreateOpen, setIsArticleCreateOpen] = useState(false);
  const [collectionData, setCollectonData] = useState({
    name: "",
    isPublic: false,
  });

  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShow(false);
      setIsArticleCreateOpen(false);
    }
  };

  const createCollection = async () => {
    try {
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
    } catch (error) {
      console.error("Error creating collection", error);
    }
  };

  const GET_USER_COLLECTIONS = gql`
    query MyQuery($username: String!, $articleSlug: String!) {
      user(username: $username) {
        collections(number: 10) {
          id
          name
          isAdded(articleSlug: $articleSlug)
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
    try {
      const { data } = await client.query({
        query: GET_USER_COLLECTIONS,
        variables: {
          username: user?.username,
          articleSlug: articleSlug,
        },
        fetchPolicy: "network-only",
      });
      if (data) {
        setLoading(false);
        setCollections(data.user.collections);
      }
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  useEffect(() => {
    fetchCollections();

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="rounded-md fixed top-0 left-0 backdrop-blur-sm bg-black bg-opacity-50 w-full h-full flex justify-center items-center">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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
                className="p-2 bg-transparent border rounded-md"
                placeholder="Name"
              />
              <div>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setCollectonData({
                      ...collectionData,
                      isPublic: e.target.checked,
                    });
                  }}
                  checked={collectionData.isPublic}
                />
                <span>Public</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="border p-1 rounded-md"
                  onClick={() => {
                    setIsArticleCreateOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 p-1 rounded-md"
                  onClick={createCollection}
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div
              className="bg-neutral-800 p-4 rounded-md space-y-2 flex flex-col"
              ref={ref}
            >
              {collections.map((collection) => (
                <AddArticleToCollection
                  key={collection.id}
                  onToggle={(status) => {
                    setCollections(
                      collections.map((c) => {
                        if (c.id === collection.id) {
                          return { ...c, isAdded: status };
                        }
                        return c;
                      })
                    );
                  }}
                  collection={collection}
                  articleSlug={articleSlug}
                />
              ))}
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
        </>
      )}
    </div>
  );
};
