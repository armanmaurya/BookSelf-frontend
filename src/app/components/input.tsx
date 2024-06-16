"use client";
import { useRouter } from "next/navigation";

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

const SearchInput = () => {
  const router = useRouter();

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return;
      }
      router.push(`/search/${event.target.value}`);
    }
  };

  return (
    <input
      id="search-bar"
      className="border p-1 px-2 rounded-full border-zinc-900 w-full"
      placeholder="Search..."
      type="text"
      onKeyDown={handleKeyPress}
    />
  );
};

export default SearchInput;
