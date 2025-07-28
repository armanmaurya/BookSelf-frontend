"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const UsernameForm = ({
    data,
}: {
    data: {
        first_name: string;
        last_name: string;
    };
}) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        username: "",
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (isDisabled || isSubmitting) return;

        setIsSubmitting(true);

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
                toast({
                    title: "Success!",
                    description: "Account created successfully! Redirecting...",
                });
                
                // Add a small delay to show the toast before redirecting
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Registration failed",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
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
        <form className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-md border" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Complete Your Profile</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="first_name">
                            First Name
                        </Label>
                        <Input
                            id="first_name"
                            onChange={handleChange}
                            defaultValue={data.first_name}
                            name="first_name"
                            type="text"
                            placeholder="First Name"
                            value={formData.first_name}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="last_name">
                            Last Name
                        </Label>
                        <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            defaultValue={data.last_name}
                            name="last_name"
                            type="text"
                            placeholder="Last Name"
                            required
                        />
                    </div>
                </div>

                <div className="relative">
                    <Label htmlFor="username">
                        Username
                    </Label>
                    <div className="relative">
                        <Input
                            id="username"
                            spellCheck={false}
                            value={formData.username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                                debounceCheckUsername(e.target.value);
                            }}
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            className="pr-10"
                            required
                            minLength={4}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isChecking ? (
                                <span className="text-muted-foreground animate-pulse">...</span>
                            ) : isDisabled && formData.username.length > 0 ? (
                                <span className="text-destructive">✗</span>
                            ) : !isDisabled ? (
                                <span className="text-green-500">✔</span>
                            ) : null}
                        </div>
                    </div>
                    {usernameError && (
                        <p className="mt-1 text-sm text-destructive">{usernameError}</p>
                    )}
                    {!usernameError && formData.username.length > 0 && !isDisabled && (
                        <p className="mt-1 text-sm text-green-500">Username available!</p>
                    )}
                    {formData.username.length === 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">At least 4 characters</p>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isDisabled || isSubmitting}
                        className="w-full"
                        variant={isDisabled ? "secondary" : "default"}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Creating account...
                            </div>
                        ) : isDisabled ? (
                            "Please choose a valid username"
                        ) : (
                            "Complete Registration"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};