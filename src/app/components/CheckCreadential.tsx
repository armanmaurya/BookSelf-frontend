"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const CheckCreadential = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/verify", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        setIsAuthenticated(true);
        console.log("Authenticated");
      } else {
        console.log("access token expired, checking using refresh token");
        const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: localStorage.getItem("refreshToken"),
          }),
        });
        if (res.ok) {
          console.log("checking using refresh token");
          const data = await res.json();
          localStorage.setItem("accessToken", data.access);
          console.log("Authenticated");
          setIsAuthenticated(true);
        } else {
          console.log("Not authenticated");
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.log("Network error");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <>
      {isAuthenticated ? (
        <li>
          <Link href="/logout">Logout</Link>
        </li>
      ) : (
        <>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </>
      )}
    </>
  );
};

export default CheckCreadential;
