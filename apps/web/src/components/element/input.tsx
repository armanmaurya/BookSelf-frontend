"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { User } from "@/types/auth";
import Link from "next/link";

export const EmailInput = ({
  email,
  handleChange,
}: {
  email: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="w-full">
      <label htmlFor="email" className="text-sm font-bold text-gray-600">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => handleChange(e)}
        required
        className="w-full border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export const TextInput = ({
  name,
  value,
  handleChange,
}: {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-sm font-bold text-gray-600">
        {name}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        placeholder={name}
        onChange={(e) => handleChange(e)}
        required
        className="w-full border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export const PasswordInput = ({
  name,
  value,
  handleChange,
}: {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="w-full">
      <label htmlFor="password" className="text-sm font-bold text-gray-600">
        Password
      </label>
      <input
        type="password"
        name={name}
        value={value}
        placeholder="Password"
        onChange={(e) => handleChange(e)}
        required
        className="w-full border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

// It will search for users when @username is typed in the search bar otherwise it will search for articles
export const SearchInput = () => {
  const router = useRouter();

  const QUERY = gql`
    query MyQuery($username: String!) {
      users(username: $username) {
        id
        username
        profilePicture
        firstName
        lastName
      }
    }
  `;

  const searchUser = async (username: string) => {
    const { data } = await client.query({
      query: QUERY,
      variables: { username },
    });
    return data.users;
  };

  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!searchQuery.startsWith("@")) {
      setUsers([]);
      return;
    }
    if (searchQuery.trim() === "@") {
      setUsers([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      const username = searchQuery.slice(1);
      if (username.length > 0) {
        const results = await searchUser(username);
        setUsers(results);
      } else {
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      if (searchQuery.startsWith("@")) {
        // If starts with @, go to user profile if only one result
        if (users.length === 1) {
          router.push(`/profile/${users[0].username}`);
        }
      } else {
        router.push(`/search/${searchQuery}`);
      }
      setUsers([]);
    }
  };

  return (
    <div className="relative w-96">
      <input
        id="search-bar"
        autoComplete="off"
        className="border dark:border-neutral-600 dark:bg-neutral-800 dark:text-white w-full p-2 px-4 rounded-full border-zinc-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 sm:block hidden transition-all"
        placeholder="Search users with @ or articles..."
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 500)}
      />
      {/* Search results dropdown */}
      {isFocused && users.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
          {users.map((user) => (
            <Link
              href={`/user/${user.username}`}
              key={user.id}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
            >
              <img
                src={user.profilePicture || "https://writedirection.com/wp-content/uploads/2016/09/blank-profile-picture-973460_960_720.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://writedirection.com/wp-content/uploads/2016/09/blank-profile-picture-973460_960_720.png";
                }}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const TagInput = ({
  id,
  initialTags,
}: {
  id: string;
  initialTags: string[];
}) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const removeTag = (index: number) => {
    setTags([...tags.slice(0, index), ...tags.slice(index + 1)]);
  };
  const addTag = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const newTag = event.currentTarget.value;
    if (tags.includes(newTag)) {
      setHighlightedTag(newTag); // Highlight the tag instead of adding it
      setTimeout(() => setHighlightedTag(""), 1500); // Reset highlightedTag after 3 seconds
      return;
    }
    setTags([...tags, event.currentTarget.value]);
    event.currentTarget.value = "";
  };

  const UpdateTags = async (tags: string[]) => {
    const csrf = Cookies.get("csrftoken");
    try {
      const res = await fetch(`${API_ENDPOINT.article.url}?slug=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        body: JSON.stringify({ tags: tags }),
        credentials: "include",
      });
    } catch (error) {}
  };

  const [highlightedTag, setHighlightedTag] = useState<string | null>(null);

  useEffect(() => {
    UpdateTags(tags);
  }, [tags]);

  return (
    <div className="border rounded-md p-2 w-full flex">
      <div>
        <span className="dark:text-gray-600">Tags:</span>
      </div>
      <div className="">
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag}
            onClick={() => removeTag(index)}
            isHighlighted={tag === highlightedTag}
          />
        ))}
      </div>
      <input
        id="tag-bar"
        className="flex-grow bg-transparent"
        // placeholder="Tag..."
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTag(e);
          }
          if (e.key === "Backspace" && e.currentTarget.value === "") {
            setTags([...tags.slice(0, tags.length - 1)]);
          }

          if (e.key === " ") {
            addTag(e);
          }
        }}
      />
    </div>
  );
};

export const Tag = ({
  tag,
  onClick,
  isHighlighted = false,
}: {
  tag: string;
  onClick: () => void;
  isHighlighted?: boolean;
}) => {
  return (
    <span className="m-1 dark:bg-neutral-600 rounded p-1">
      <span className={`${isHighlighted ? "text-yellow-300" : ""}`}>{tag}</span>
      <img
        onClick={onClick}
        src="https://img.icons8.com/?size=100&id=9433&format=png&color=000000"
        alt=""
        className="h-4 inline hover:cursor-pointer hover:bg-gray-500 m-0.5 rounded-md"
      />
    </span>
  );
};

export const Input = (
  InputProp: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <input
      {...InputProp}
      style={{
        padding: "0.5rem",
      }}
      className={`rounded-md ${InputProp.className || ""}`}
    />
  );
};
