"use client";
import { gql } from "@apollo/client";
import React, { useRef, useState } from "react";
import client from "@/lib/apolloClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoClose } from "react-icons/io5";

// Define form schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  about: z.string().optional(),
});

export function ProfileForm({
  defaultFirstName,
  defaultLastName,
  defaultAbout,
}: {
  defaultFirstName: string;
  defaultLastName: string;
  defaultAbout: string;
}) {
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      about: defaultAbout,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccess(false);
    const { firstName, lastName, about } = values;

    const MUTATION = gql`
      mutation UpdateProfile(
        $firstName: String!
        $lastName: String!
        $about: String
      ) {
        updateProfile(
          firstName: $firstName
          lastName: $lastName
          about: $about
        ) {
          firstName
          lastName
          about
        }
      }
    `;

    try {
      const { data, errors } = await client.mutate({
        mutation: MUTATION,
        variables: { firstName, lastName, about },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      setSuccess(true);
    } catch (err: any) {
      form.setError("root", {
        message: err.message || "Failed to update profile",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {success && (
          <Alert variant="default" className="animate-fade-in">
            <AlertDescription>Profile updated successfully!</AlertDescription>
            <button
              type="button"
              aria-label="Close"
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setSuccess(false)}
            >
              <IoClose className="h-4 w-4" />
            </button>
          </Alert>
        )}

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Name Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Name</h2>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">About</h2>
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}