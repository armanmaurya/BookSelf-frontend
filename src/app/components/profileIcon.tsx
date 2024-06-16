"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "./context";
import Link from "next/link";
import { API_ENDPOINT } from "../utils";
import Cookies from "js-cookie";

const ProfileIcon = () => {
  const appContext = useContext(AppContext);
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch(API_ENDPOINT.logout.url, {
        method: API_ENDPOINT.logout.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (res.ok) {
        console.log("Logout successful");
        window.location.href = "/account/signin";
      }
    } catch (error) {
      console.log("Network error");
    }
  };
  const newArticle = async () => {
    const csrf = Cookies.get("csrftoken");
    try {
      const res = await fetch(API_ENDPOINT.article.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": `${csrf}`,
        },
        credentials: "include",
      });
      
      if (res.ok) {
        console.log("Article created");
        const data = await res.json();
        // console.log(data);
        
        router.push(`/editor/${data.id}`);
      }
    } catch (error) {
      console.log("Network error");
    }
  }

  const ProfileRoute = () => {
    router.push("/account/profile");
  };

  const toggle = () => {
    setIsOpened(!isOpened);
  };
  return (
    <>
      {appContext.isAuthenticated ? (
        <div className="">
          <div
            className="bg-black h-8 w-8 rounded-full hover:cursor-pointer"
            onClick={toggle}
          ></div>
          <div
            className={`${
              isOpened ? "h-44" : "h-0"
            } flex overflow-hidden ease-in-out absolute top-14 right-7 bg-gray-100  rounded-2xl shadow-xl w-40 items-center justify-center`}
          >
            <ul className="space-y-1 p-2 w-full items-center">
              <button
                onClick={ProfileRoute}
                className="bg-gray-200 rounded p-1.5 w-full"
              >
                Profile
              </button>
              <li className="bg-gray-200 rounded p-1.5 w-full text-center">
                Settings
              </li>
              <li className="bg-gray-200 rounded p-1.5 w-full text-center">
                <button onClick={newArticle}>New Article</button>
              </li>
              <button
                onClick={logout}
                className="bg-gray-200 rounded p-1.5 w-full"
              >
                Logout
              </button>
            </ul>
          </div>
        </div>
      ) : (
        <li className=" space-x-3 mr-2">
          <a
            className="border p-1.5 bg-sky-500 text-slate-50 rounded-2xl"
            href="/account/signup"
          >
            Create Account
          </a>
          <Link className="text-sky-500" href="/account/signin">
            Login
          </Link>
        </li>
      )}
    </>
  );
};

export default ProfileIcon;
