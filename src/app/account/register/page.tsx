"use client";
import { useState } from "react";
import { Bars } from "react-loader-spinner";

export default function Register() {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    code: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (response.ok) {
        // Handle successful response
        // console.log("Registration successful");
        const data = await response.json();
        // console.log(data);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("accessToken", data.access);
      } else {
        // Handle error response
        console.log("Registration failed");
      }
    } catch (error) {
      // Handle network error
      console.log("Network error");
    }
  };

  const SendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProgressBarVisible(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/send-verification-code/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (response.ok) {
        setForm((prevForm) => ({
          ...prevForm,
          email: form.email,
        }));
        setIsCodeSent(true);
        console.log("Code sent");
        setIsProgressBarVisible(false);
      }
    } catch (error) {
      console.log("Network error");
    }
  };

  const VerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/verify-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (response.ok) {
        console.log("Email verified");
        setIsCodeVerified(true);
      }
    } catch (error) {
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
    <main>
      <div className="flex items-center justify-center h-screen">
        {isCodeVerified ? (
          <form
            className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
            onSubmit={handleSubmit}
          >
            <h1>Form</h1>
            <div className="">
              <label htmlFor="code">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="border rounded w-full"
                value={form.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="border rounded w-full"
                value={form.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="border rounded w-full"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="password2">Password (again):</label>
              <input
                type="password"
                id="password2"
                name="password2"
                className="border rounded w-full"
                value={form.password2}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded"
            >
              Register
            </button>
          </form>
        ) : (
          <div>
            {isCodeSent ? (
              <form
                className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
                onSubmit={VerifyCode}
              >
                <h1>Enter OTP</h1>
                <div className="">
                  <label htmlFor="code">Code:</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="border rounded w-full"
                    value={form.code}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 p-2 text-white rounded"
                >
                  Register
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
                onSubmit={SendCode}
              >
                <h1>Verify Email</h1>
                <div className="">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="border rounded w-full"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {isProgressBarVisible ? (
                  <div className="flex items-center justify-center">
                    <Bars color="#000" height={80} width={80} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 p-2 text-white rounded"
                  >
                    Send Code
                  </button>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
