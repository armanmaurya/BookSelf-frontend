"use client";
import { gql } from "@apollo/client";
import { useState } from "react";
import client from "@/lib/apolloClient";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FaSpinner } from "react-icons/fa";

export const DeleteAccountBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { toast } = useToast();

  const MUTATION = gql`
    mutation MyMutation {
      deleteUser
    }
  `;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const { data, errors } = await client.mutate({
        mutation: MUTATION,
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      if (data?.deleteUser) {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
        window.location.href = "/";
      } else {
        throw new Error("Account deletion failed");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      setConfirmationText("");
    }
  };

  const isConfirmed = confirmationText === "CONFIRM";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 mt-4">
          <Label htmlFor="confirmation">
            Type <span className="font-mono text-destructive">CONFIRM</span> to continue:
          </Label>
          <Input
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
            placeholder="Type CONFIRM"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={!isConfirmed || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && (
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};