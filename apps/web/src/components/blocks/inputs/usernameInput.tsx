"use client";
import { TextInput } from "@/components/element/inputs/textInput";
import { checkUsername } from "@/utils/account/checkUsername";
import { useState, useRef } from "react";

export const UsernameInput = () => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "available" | "taken"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove spaces from the input
    value = value.replace(/\s+/g, "");
    setUsername(value);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value) {
      setStatus("idle");
      return;
    }
    setStatus("loading");
    debounceRef.current = setTimeout(async () => {
      try {
        const available = await checkUsername(value);
        setStatus(available ? "available" : "taken");
      } catch (err) {
        setError("Error checking username");
        setStatus("idle");
      }
    }, 500);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="username"
        className="block text-sm font-medium text-white"
      >
        Username
      </label>
      <TextInput onChange={handleChange} value={username} />
      {status === "loading" && (
        <p className="text-blue-400 text-xs">Checking...</p>
      )}
      {status === "available" && (
        <p className="text-green-400 text-xs">Username is available!</p>
      )}
      {status === "taken" && (
        <p className="text-red-400 text-xs">Username is already taken.</p>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};
