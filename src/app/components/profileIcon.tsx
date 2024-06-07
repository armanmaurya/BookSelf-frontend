"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import CheckCreadential from "./CheckCreadential";
import { AppContext } from "./SideBarContext";
import Link from "next/link";

const ProfileIcon = () => {
  const appContext = useContext(AppContext);
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();


  const logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/account/login";
  };
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
            } flex overflow-hidden transition-all ease-in-out absolute top-12 right-5 bg-gray-100  rounded-md shadow-xl w-28 items-center justify-center`}
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
                <Link href="/upload">Upload</Link>
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
            href="/account/register"
          >
            Create Account
          </a>
          <Link className="text-sky-500" href="/account/login">
            Login
          </Link>
        </li>
      )}
    </>
  );
};

export default ProfileIcon;
