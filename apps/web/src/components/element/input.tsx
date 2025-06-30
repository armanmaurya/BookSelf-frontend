"use client";
import { API_ENDPOINT } from "@/app/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { User } from "@/types/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const QUERY = gql`
    query SearchUsers($username: String!) {
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
    setIsLoading(true);
    try {
      const { data } = await client.query({
        query: QUERY,
        variables: { username },
      });
      return data.users;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.startsWith("@")) {
      setUsers([]);
      return;
    }

    const username = searchQuery.slice(1);
    if (username.length < 1) {
      setUsers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const results = await searchUser(username);
      setUsers(results);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      if (searchQuery.startsWith("@") && users.length === 1) {
        router.push(`/user/${users[0].username}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Input
          id="search-bar"
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2 rounded-full"
          placeholder="Search users with @ or articles..."
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.startsWith("@")) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {isOpen && searchQuery.startsWith("@") && (
        <Command className="absolute top-12 w-full rounded-lg shadow-lg border max-h-96 min-h-24 overflow-y-auto">
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : users.length > 0 ? (
              <CommandGroup heading="Users">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.username}
                    onSelect={() => {
                      router.push(`/user/${user.username}`);
                      setIsOpen(false);
                    }}
                    className="cursor-pointer min-h-[48px]"
                  >
                    <Avatar className="mr-3 h-8 w-8">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>
                        {user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="py-6 text-center text-sm">
                No users found
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
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

export const CustomInput = (
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
