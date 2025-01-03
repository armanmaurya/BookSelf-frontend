"use client";
import { use, useEffect, useRef, useState } from "react";
import { FloatingBtn } from "../element/button";
import { FaBook } from "react-icons/fa";
import { motion, AnimationControls, AnimatePresence, AnimationProps } from "framer-motion";

export const NewNotebookBtn = () => {
    const [showModal, setShowModal] = useState(false);
    const modelRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
            setShowModal(false);
        }
    };

    const varients = {
        collapsed: {
            padding: "6px",
            right: "1%",
            bottom: "1%",
            width: "inherit",
            height: "inherit",
            transform: "translate(0%, 0%)"
        },
        expanded: {
            right: "50%",
            bottom: "50%",
            width: "inherit",
            height: "inherit",
            transform: "translate(50%, 50%)"
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <AnimatePresence>
                {showModal && (
                    <motion.div className="absolute w-full h-full dark:bg-neutral-700 dark:bg-opacity-50 top-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                variants={varients}
                ref={modelRef}
                className="absolute rounded-md bg-neutral-900"
                initial="collapsed"
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    type: "tween"
                }}
                animate={showModal ? "expanded" : "collapsed"}
            >
                {showModal ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl">New Notebook</h1>
                        <input type="text" placeholder="Notebook Name" />
                        <button>Create</button>
                    </div>
                ) : (
                    <button className="flex items-center gap-1" onClick={() => setShowModal(true)}>
                        <FaBook />
                        <span>New</span>
                    </button>
                )}
            </motion.div>

        </div>
    );
};
