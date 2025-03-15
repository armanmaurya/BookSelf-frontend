"use client";
import Image from "next/image";
import googleImg from "./google.png";
import { getGoogleAuthUrl } from "../app/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import nProgress from "nprogress";
import { useLoading } from "@bookself/react-loading";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";

export const GoolgeAuth = ({ redirect_path }: { redirect_path: string }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const googleAuthUrl = getGoogleAuthUrl(redirect_path);
  const loader = useLoading();
  const { setUser } = useAuth();

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

  const socialLogin = async () => {
    if (!code) {
      return;
    }
    // console.log("Query", query.definitions);
    loader.show();
    try {
      const { data } = await client.mutate({
        mutation: GOOGLE_AUTH,
        variables: {
          redirectPath: redirect_path,
          token: code,
        }
      });
      if (data.googleAuth.isCreated !== true) {
        setUser(data.googleAuth.user);
        loader.hide();
        nProgress.start();
        router.push("/");
      }
      loader.hide();
    } catch (error) {
      console.log("Network error", error);
    }
  };

  useEffect(() => {
    socialLogin();
  }, [code]);

  return (
    <div>
      <a
        className="border hover:cursor-pointer h-11 relative rounded-md w-80 flex justify-center items-center"
        href={googleAuthUrl}
      >
        <Image src={googleImg} alt="google" height={32} />
        <span className="text-base">Continue with Google</span>
      </a>
    </div>
  );
};
