import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  className = "",
  type = "text",
  placeholder = "Choose a username",
  ...props
}) => {
  return (
    <input
      type={type}
      {...(value !== undefined ? { value } : {})}
      {...(onChange ? { onChange } : {})}
      className={`w-full bg-neutral-700 border border-neutral-600 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      autoComplete="off"
      {...props}
    />
  );
};
