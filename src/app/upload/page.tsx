"use client";
import { useState } from "react";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(localStorage.getItem("accessToken"));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/article/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        // Handle successful response
        // console.log("Registration successful");
        const data = await response.json();
        // console.log(data);
        console.log("Article uploaded successfully");
        // console.log(data);
        window.location.href = "/";
      } else {
        // Handle error response
        console.log("Registration failed");
      }
    } catch (error) {
      // Handle network error
      console.log("Network error");
    }
  };
  return (
    <main className="p-3 h-full">
      <div className="h-full">
        <form
          className="flex flex-col space-y-3 h-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            className="border p-1"
            placeholder="Title"
            onChange={handleChange}
          />
          <textarea
            className="border h-full p-2"
            name="content"
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="bg-blue-500 rounded text-white">
            Upload
          </button>
        </form>
      </div>
    </main>
  );
}
