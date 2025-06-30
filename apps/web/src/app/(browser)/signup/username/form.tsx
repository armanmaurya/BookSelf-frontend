"use client";
import { Button } from "@/components/element/button";
import { Form } from "@/components/element/form";
import { CustomInput } from "@/components/element/input";
import { useState } from "react";
import { Store } from "react-notifications-component";

export const UsernameForm = ({
    data,
}: {
    data: {
        first_name: string;
        last_name: string;
    };
}) => {
    const [formData, setFormData] = useState({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        username: "",
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Final validation check
        if (isDisabled) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (res.status == 201) {
                window.location.href = "/";
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }
        } catch (error) {
            Store.addNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Registration failed",
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                },
            });
        }
    };

    const debounce = (mainFunction: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                mainFunction(...args);
            }, delay);
        };
    };

    const checkUsername = async (username: string) => {
        if (username.length < 4) {
            setIsDisabled(true);
            setUsernameError("Username must be at least 4 characters");
            setIsChecking(false);
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setIsDisabled(true);
            setUsernameError("Only letters, numbers, and underscores allowed");
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        setUsernameError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/checkusername/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (res.status === 200) {
                setIsDisabled(false);
                setUsernameError("");
            } else if (res.status === 400) {
                setIsDisabled(true);
                setUsernameError("Username is already taken");
            }
        } catch (error) {
            setIsDisabled(true);
            setUsernameError("Error checking username availability");
        } finally {
            setIsChecking(false);
        }
    };

    // Remove useCallback, just use the debounced function directly
    const debounceCheckUsername = debounce((username: string) => checkUsername(username), 500);

    return (
        <Form className="max-w-md mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6 text-center">Complete Your Profile</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
                            First Name
                        </label>
                        <CustomInput
                            id="first_name"
                            onChange={handleChange}
                            defaultValue={data.first_name}
                            name="first_name"
                            type="text"
                            placeholder="First Name"
                            value={formData.first_name}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
                            Last Name
                        </label>
                        <CustomInput
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            defaultValue={data.last_name}
                            name="last_name"
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <CustomInput
                            id="username"
                            spellCheck={false}
                            value={formData.username}
                            onChange={(e) => {
                                handleChange(e);
                                debounceCheckUsername(e.target.value);
                            }}
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            required
                            minLength={4}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isChecking ? (
                                <span className="text-neutral-400 dark:text-neutral-500 animate-pulse">...</span>
                            ) : isDisabled && formData.username.length > 0 ? (
                                <span className="text-red-500">✗</span>
                            ) : !isDisabled ? (
                                <span className="text-green-500">✔</span>
                            ) : null}
                        </div>
                    </div>
                    {usernameError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{usernameError}</p>
                    )}
                    {!usernameError && formData.username.length > 0 && !isDisabled && (
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400">Username available!</p>
                    )}
                    {formData.username.length === 0 && (
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">At least 4 characters</p>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                            isDisabled 
                                ? "bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed" 
                                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        }`}
                    >
                        {isDisabled ? "Please choose a valid username" : "Complete Registration"}
                    </Button>
                </div>
            </div>
        </Form>
    );
};