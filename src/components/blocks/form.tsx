"use client";
import { useContext, useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { EmailInput, PasswordInput, TextInput } from "@/components/element/input";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { Oval } from "react-loader-spinner";
import { AppContext } from "@/components/context";
import { API_ENDPOINT } from "@/app/utils";


export const LoginForm = () => {
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const context = useContext(AppContext);
  const router = useRouter();

  // useEffect(() => {
  //   if (context.isAuthenticated) {
  //     router.push("/");
  //   }
  // });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProgressBarVisible(true);
    try {
      const response = await fetch(
        API_ENDPOINT.login.url,
        {
          method: API_ENDPOINT.login.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      if (response.ok) {
        // Handle successful response
        window.location.href = "/";
        // setIsProgressBarVisible(false);
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

  return (
    <form
      className="flex flex-col space-y-3 items-center"
      onSubmit={handleSubmit}
    >
      <EmailInput email={form.email} handleChange={handleChange} />
      <PasswordInput
        name="password"
        value={form.password}
        handleChange={handleChange}
      />
      <div className="bg-blue-500 p-2 h-10 w-24 flex justify-center items-center text-white rounded">
        {isProgressBarVisible ? (
          <Oval color="#ffff" strokeWidth="5" height={28} width={28} />
        ) : (
          <button type="submit" className="">
            Login
          </button>
        )}
      </div>
    </form>
  );
};

export const VerifyEmailForm = () => {
  const router = useRouter();
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);

  const [form, setForm] = useState({
    email: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const SendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProgressBarVisible(true);
    try {
      const response = await fetch(
        API_ENDPOINT.sendcode.url,
        {
          method: API_ENDPOINT.sendcode.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      if (response.ok) {
        router.push("signup/enter-otp/");
        setIsProgressBarVisible(false);
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
      setIsProgressBarVisible(false);
      Store.addNotification({
        message: "Network error",
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
  return (
    <form
      className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
      onSubmit={SendCode}
    >
      <h1>Verify Email</h1>
      <EmailInput email={form.email} handleChange={handleChange} />

      <div className="bg-blue-500 p-2 h-10 w-24 flex justify-center items-center text-white rounded">
        {isProgressBarVisible ? (
          <Oval color="#ffff" strokeWidth="5" height={28} width={28} />
        ) : (
          <button type="submit" className="">
            Send
          </button>
        )}
      </div>
    </form>
  );
};

export const VerifyCodeForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
  });

  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);

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
        API_ENDPOINT.verifycode.url,
        {
          method: API_ENDPOINT.verifycode.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      if (response.ok) {
        router.push("fill-details/");
        setIsProgressBarVisible(false);
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
      setIsProgressBarVisible(false);
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
  return (
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

      <div className="bg-blue-500 p-2 h-10 w-24 flex justify-center items-center text-white rounded">
        {isProgressBarVisible ? (
          <Oval color="#ffff" strokeWidth="5" height={28} width={28} />
        ) : (
          <button type="submit" className="">
            Verify
          </button>
        )}
      </div>
    </form>
  );
};

export const FillDetailsForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
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
        API_ENDPOINT.register.url,
        {
          method: API_ENDPOINT.register.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      if (response.ok) {
        // router.push("/");
        window.location.href = "/";
        setIsProgressBarVisible(false);
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
      });
      // Handle network error
      console.log("Network error");
    }
  };
  return (
    <form
      className="flex flex-col border w-80 p-4 rounded-md items-center justify-center space-y-3"
      onSubmit={handleSubmit}
    >
      <h1>Form</h1>
      <TextInput
        name="first_name"
        value={form.first_name}
        handleChange={handleChange}
      />
      <TextInput
        name="last_name"
        value={form.last_name}
        handleChange={handleChange}
      />
      <PasswordInput
        name="password"
        value={form.password}
        handleChange={handleChange}
      />
      <PasswordInput
        name="password2"
        value={form.password2}
        handleChange={handleChange}
      />
      <div className="bg-blue-500 p-2 h-10 w-24 flex justify-center items-center text-white rounded">
        {isProgressBarVisible ? (
          <Oval color="#ffff" strokeWidth="5" height={28} width={28} />
        ) : (
          <button type="submit" className="">
            Send
          </button>
        )}
      </div>
    </form>
  );
};
