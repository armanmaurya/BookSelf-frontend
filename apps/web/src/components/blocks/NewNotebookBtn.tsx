"use client";
import { use, useEffect, useRef, useState } from "react";
import { FloatingBtn } from "../element/button";
import { FaBook } from "react-icons/fa";
import { motion, AnimationControls, AnimatePresence } from "framer-motion";

export const NewNotebookBtn = () => {
    const [showModal, setShowModal] = useState(false);
    const modelRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
            setShowModal(false);
        }
    };

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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="absolute h-full w-full dark:bg-neutral-700 dark:bg-opacity-40 top-0 flex items-center justify-center"
                    >
                        <motion.div
                            ref={modelRef}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="h-1/2 w-1/4 flex items-center justify-center dark:bg-neutral-900 shadow-lg rounded-lg"
                        >
                            Model
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {
                !showModal && (
                    <FloatingBtn className="hover:scale-110 transition" onClick={() => setShowModal(!showModal)}>
                        <FaBook />
                        <span className="px-1">New</span>
                    </FloatingBtn>
                )
            }
        </div>
    );
};
