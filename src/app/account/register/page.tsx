"use client";
import RNotification from "@/app/components/RNotification";
import { useState } from "react";
import { Bars, ThreeCircles } from "react-loader-spinner";
import { Store } from "react-notifications-component";
import OtpInput from "react-otp-input";

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
    setIsProgressBarVisible(true);

    if (!form.first_name || !form.last_name || !form.password) {
      setIsProgressBarVisible(false);
      Store.addNotification({
        message: "All fields are required",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      });
      return;
    }

    if (form.password !== form.password2) {
      setIsProgressBarVisible(false);
      Store.addNotification({
        message: "Passwords do not match",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      });
      return;
    }
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
        setIsProgressBarVisible(false);
        Store.addNotification({
          message: "Registration successful! Redirecting...",
          type: "success",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
        window.location.href = "/";
      } else {
        // Handle error response
        setIsProgressBarVisible(false);
        Store.addNotification({
          message: "Registration failed",
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
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
      Store.addNotification({
        message: "Network Error",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      
      })
      // Handle network error
      console.log("Network error");
    }
  };

  const SendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email) {
      Store.addNotification({
        message: "Email is required",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      });
      return;
    }
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
        setIsProgressBarVisible(false);
        Store.addNotification({
          message: "Code sent successfully!",
          type: "success",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
      } else {
        setIsProgressBarVisible(false);
        const data = await response.json();
        Store.addNotification({
          message: `${data.email[0]}`,
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
      }
    } catch (error) {
      console.log("Network error");
    }
  };

  const VerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.code) {
      Store.addNotification({
        message: "Code is required",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      });
      return;
    }
    setIsProgressBarVisible(true);
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
        setIsProgressBarVisible(false);
        Store.addNotification({
          message: "Code verified successfully!",
          type: "success",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
        setIsCodeVerified(true);
      } else {
        setIsProgressBarVisible(false);
        Store.addNotification({
          message: "Invalid code!",
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated animate__faceIn"],
          animationOut: ["animate__animated animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            showIcon: true,
          },
        });
      }
    } catch (error) {
      Store.addNotification({
        message: "Code verification failed!",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated animate__faceIn"],
        animationOut: ["animate__animated animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: false,
          pauseOnHover: true,
          showIcon: true,
        },
      });
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
      {isProgressBarVisible && (
        <div className="flex items-center justify-center absolute bg-zinc-300 bg-opacity-20 h-full w-full">
          <ThreeCircles color="#000" height={50} width={50} />
        </div>
      )}
      <RNotification />
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
                className="border rounded w-full p-1"
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
                className="border rounded w-full p-1"
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
                className="border rounded w-full p-1"
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
                className="border rounded w-full p-1"
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
                <div className="w-full">
                  <OtpInput
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e })}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input name="code" {...props} />}
                    inputStyle={{
                      height: "40px",
                      width: "40px",
                      fontSize: "20px",
                      textAlign: "center",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      margin: "0 5px",
                    }}
                    containerStyle={"flex justify-center w-full"}
                    inputType="number"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 p-2 text-white rounded"
                >
                  Verify
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
                    className="border rounded w-full p-1"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 p-2 text-white rounded"
                >
                  Send Code
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
