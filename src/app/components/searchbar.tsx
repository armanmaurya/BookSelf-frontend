"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      router.push(`/search/${event.target.value}`);
    }
  };

  return (
    <input
      id="search-bar"
      className="border p-1 rounded-md border-zinc-900 w-full"
      placeholder="search"
      type="text"
      onKeyDown={handleKeyPress}
    />
  );
};

export default SearchBar;
