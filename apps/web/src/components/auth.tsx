"use client";
import Image from "next/image";
import googleImg from "./google.png";
import { getGoogleAuthUrl } from "../app/utils";
import { Oval } from "react-loader-spinner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { API_ENDPOINT } from "../app/utils";
import { ConverLoading } from "./converLoading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import nProgress from "nprogress";
import { useLoading } from "@bookself/react-loading";
import client from "@/lib/apolloClient";
import { gql, useMutation } from "@apollo/client";

export const GoolgeAuth = ({ redirect_path }: { redirect_path: string }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const googleAuthUrl = getGoogleAuthUrl(redirect_path);
  const loader = useLoading();
  const { setUser } = useAuth();

  // if (code) {
  //   loader.show();
  // }

  const GOOGLE_AUTH = gql`
    mutation MyMutation($redirectPath: String!, $token: String!) {
      googleAuth(redirectPath: $redirectPath, token: $token) {
        isCreated
        user {
          username
          lastName
          firstName
        }
      }
    }
  `;

  const [googleAuth, { data, loading, error }] = useMutation(GOOGLE_AUTH);

  // console.log("Data", data);

  const socialLogin = async () => {
    if (!code) {
      return;
    }
    // console.log("Query", query.definitions);
    loader.show();
    try {
      const { data } = await googleAuth({
        variables: { redirectPath: redirect_path, token: code },
      });
      if (data.googleAuth.isCreated !== true) {
        setUser(data.googleAuth.user);
        loader.hide();
        nProgress.start();
        router.push("/");
      }
      loader.hide();
      // const { data } = await client.mutate({ mutation: gql`${query}` });
      // const data = useMutation(gql`${query}`);
      // console.log("Data", data);
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql/`, {
      //   body: JSON.stringify({ query }),
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Accept": "application/json" // (Optional, but some servers require it)
      //   },
      // })

      // console.log("Response", res);
      // console.log(data);
      // const response = await fetch(
      //   `${API_ENDPOINT.googleAuth.url}?code=${code}&redirect_path=${redirect_path}`,
      //   {
      //     method: API_ENDPOINT.googleAuth.method,
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     credentials: "include",
      //   }
      // );
      // if (response.status == 200) {
      //   loader.hide();
      //   setUser(await response.json());
      //   // nProgress.start();
      //   // router.push("/");

      // } else if (response.status == 201) {
      //   loader.hide();
      //   nProgress.start();
      //   router.push("/signup/username");
      // } else {
      //   console.log("Registration failed");
      //   loader.hide();
      //   Store.addNotification({
      //     title: "Error",
      //     message: "Registration failed",
      //     type: "danger",
      //     insert: "top",
      //     container: "top-center",
      //     animationIn: ["animate__animated", "animate__fadeIn"],
      //     animationOut: ["animate__animated", "animate__fadeOut"],
      //     dismiss: {
      //       duration: 5000,
      //       // onScreen: true,
      //     },
      //   });
      // }
    } catch (error) {
      console.log("Network error", error);
    }
  };

  useEffect(() => {
    socialLogin();
  }, [code]);

  return (
    <div>
      {/* {isChecking && <ConverLoading />} */}
      <a
        className="border hover:cursor-pointer h-11 relative rounded-md w-80 flex justify-center items-center"
        href={googleAuthUrl}
      >
        {/* <div className="h-full w-10 flex items-center justify-center absolute left-0">
          {isChecking && <Oval color="#000" height={20} width={20} />}
        </div> */}

        <Image src={googleImg} alt="google" height={32} />
        <span className="text-base">Continue with Google</span>
      </a>
    </div>
  );
};
