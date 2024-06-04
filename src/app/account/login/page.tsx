"use client";
import { useEffect, useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // const checkCreadential = () => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (refreshToken && accessToken) {
  //     window.location.href = "/";
  //   }
  // }
  // useEffect(() => {
  //   checkCreadential();
  // }, [])
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        // Handle successful response
        // console.log("Registration successful");
        const data = await response.json();
        // console.log(data);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("accessToken", data.access);

        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        console.log("Refresh Token:", refreshToken);
        console.log("Access Token:", accessToken);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <main className="h-full">
      <div className="flex items-center justify-center h-full">
        <form
          className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
          onSubmit={handleSubmit}
        >
          <h1>Login</h1>
          <div className="">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              className="border rounded w-full p-1"
              onChange={handleChange}
            />
          </div>
          <div className="">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full p-1"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="bg-blue-500 p-2 text-white rounded">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
