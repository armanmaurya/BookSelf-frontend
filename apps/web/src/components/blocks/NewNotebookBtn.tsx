"use client";
import { useEffect, useRef, useState } from "react";
import { Button, FloatingBtn } from "../element/button";
import { FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimationControls,
  AnimatePresence,
  AnimationProps,
} from "framer-motion";
import { CustomInput } from "../element/input";
import { API_ENDPOINT } from "@/app/utils";
import Cookies from "js-cookie";
import { Store } from "react-notifications-component";
import * as NProgress from "nprogress";

export const NewNotebookBtn = ({ username }: { username: string }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [notebookName, setNotebookName] = useState("");
  const modelRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
      setShowModal(false);
      setIsBackgroundVisible(false);
      // console.log("Clicked outside");
    }
  };

  const createNewNotebook = async (title: string) => {
    const csrf = Cookies.get("csrftoken");
    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/`, {
      body: JSON.stringify({ name: title }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": `${csrf}`,
      },
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setIsCreated(true);
      setIsBackgroundVisible(false);
      const data = await res.json();
      NProgress.start();
      router.push(`/notebook/${username}/${data.slug}/`);
    } else {
      Store.addNotification({
        title: "Error",
        message: "Notebook creation failed",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          // onScreen: true,
        },
      });
      setShowModal(false);
      console.log("Failed", res);
    }
  };

  useEffect(() => {
    if (document) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  });

  return (
    <div className="">
      <AnimatePresence>
        {isBackgroundVisible && (
          <div>
            <motion.div
              className="absolute w-full h-full dark:bg-neutral-700 dark:bg-opacity-50 top-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
          </div>
        )}
      </AnimatePresence>

      {showModal ? (
        <div className="absolute flex items-center justify-center w-full h-full">
          <motion.div
            transition={{ duration: 0.25, ease: "easeInOut" }}
            layoutId="modal"
            variants={{
              initial: { scale: 1 },
              create: {
                scale: [0.8, 0.8],
                top: ["", "-100%"],
              },
            }}
            initial="initial"
            animate={`${isCreated ? "create" : "initial"}`}
            className="absolute"
          >
            <motion.div
              ref={modelRef}
              className="flex flex-col gap-3 items-center dark:bg-neutral-900 p-2 rounded-md"
            >
              <h1 className="text-3xl">New Notebook</h1>
              <CustomInput placeholder="Notebook Name" value={notebookName} onChange={(e) => {
                setNotebookName(e.target.value);
              }} />
              <Button
                onClick={() => {
                  createNewNotebook(notebookName);

                }}
              >
                Create
              </Button>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          transition={{ duration: 0.25, ease: "easeInOut" }}
          onClick={() => {
            setShowModal(true);
            setIsBackgroundVisible(true);
          }}
          layoutId="modal"
          className="absolute flex items-center gap-1 hover:cursor-pointer right-4 bottom-3 bg-blue-500 p-1 rounded-md text-white"
        >
          <FaBook />
          <span>New</span>
        </motion.div>
      )}
    </div>
  );
};
