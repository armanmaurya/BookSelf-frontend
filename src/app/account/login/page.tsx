"use client";
import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { Store } from "react-notifications-component";
import RNotification from "@/app/components/RNotification";
import ProgressBar from "@/app/components/ProgressBar";
// import 'ldrs/zoomies'
import { zoomies } from "ldrs";

zoomies.register();

// Default values shown

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProgressBarVisible(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      if (response.ok) {
        // Handle successful response
        // window.location.href = "/";
        setIsProgressBarVisible(false);
        // Store.addNotification({
        //   message: "Login successful! Redirecting...",
        //   type: "success",
        //   insert: "top",
        //   container: "top-center",
        //   animationIn: ["animate__animated animate__bounceIn"],
        //   animationOut: ["animate__animated animate__bounceOut"],
        //   dismiss: {
        //     duration: 5000,
        //     onScreen: false,
        //     pauseOnHover: true,
        //     showIcon: true,
        //   },
        // });
      } else {
        setIsProgressBarVisible(false);
        // Handle error response
        console.log("Registration failed");
        Store.addNotification({
          message: "Email or Password is incorrect",
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__bounceIn"],
          animationOut: ["animate__animated animate__bounceOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
      }
    } catch (error) {
      setIsProgressBarVisible(false);
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

  const checklogin = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/example/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        // window.location.href = "/";
      }
    }
    catch (error) {
      console.log("Network error");
    }
  }

  useEffect(() => {
    checklogin();
  
  }, [])

  return (
    <main className="h-full">
      {isProgressBarVisible && (
        <div className="flex items-center justify-center absolute bg-zinc-300 bg-opacity-20 h-full w-full">
          {/* <ThreeCircles color="#000" height={50} width={50} /> */}
        </div>
      )}
      <RNotification />
      <div className="flex items-center justify-center h-full">
        <form
          className="flex flex-col border w-80 px-4 pb-4 rounded-md items-center justify-center space-y-3"
          onSubmit={handleSubmit}
        >
          {isProgressBarVisible && (
            <l-zoomies
              size="320"
              stroke="5"
              bg-opacity="0.1"
              speed="1.4"
              color="black"
            ></l-zoomies>
          )}
          <h1>Login</h1>
          <div className="">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
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
          <div className="">
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
