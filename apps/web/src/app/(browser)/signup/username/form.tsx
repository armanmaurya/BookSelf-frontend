"use client";
import { Button } from "@/components/element/button";
import { Form } from "@/components/element/form";
import { Input } from "@/components/element/input";
import { useState, useCallback } from "react";
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form data", formData);
        // handleSubmit(formData);

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
            console.log("User registered successfully");
        } else {
            Store.addNotification({
                title: "Error",
                message: "Registration failed",
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
            return;
        }
        console.log("Checking username", username);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/checkusername/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        if (res.status == 200) {
            setIsDisabled(false);
        }
        if (res.status == 400) {
            setIsDisabled(true);
        }
    };

    const debounceCheckUsername = useCallback(
        debounce((username: string) => checkUsername(username), 300),
        []
    );

    return (
        <Form className="justify-center items-center" onSubmit={handleSubmit}>
            <Input
                onChange={handleChange}
                defaultValue={data.first_name}
                name="first_name"
                type="text"
                placeholder="First Name"
                value={formData.first_name}
            />
            <Input
                value={formData.last_name}
                onChange={handleChange}
                defaultValue={data.last_name}
                name="last_name"
                type="text"
                placeholder="Last Name"
            />
            <div className="relative">
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {
                        isDisabled ? (
                            <span className="text-red-400">✗</span>
                        ) : (
                            <span className="text-green-400">✔</span>
                        )
                    }

                </div>
                <Input
                    spellCheck={false}
                    value={formData.username}
                    onChange={(e) => {
                        handleChange(e);
                        debounceCheckUsername(e.target.value);
                    }}
                    name="username"
                    type="text"
                    placeholder="Username"
                />
            </div>
            <Button className={` ${isDisabled ? "bg-blue-950" : ""}`} disabled={isDisabled} type="submit">Submit</Button>
        </Form>
    );
};
