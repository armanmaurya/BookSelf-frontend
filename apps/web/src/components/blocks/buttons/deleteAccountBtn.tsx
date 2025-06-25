"use client";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import client from "@/lib/apolloClient";

export const DeleteAccountBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState("");

  const MUTATION = gql`
    mutation MyMutation {
      deleteUser
    }
  `;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const { data, errors } = await client.mutate({
        mutation: MUTATION,
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      if (data?.deleteUser) {
        // Redirect to home page or show success message
        setIsOpen(false);
        setConfirmationText("");
        // Optionally, you can redirect the user or show a success message
        window.location.href = "/";
      } else {
        throw new Error("Account deletion failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmed = confirmationText === "CONFIRM";

  return (
    <>
      <button
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
        onClick={() => setIsOpen(true)}
      >
        Delete Account
      </button>

      {/* Confirmation Modal */}
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setConfirmationText("");
        }}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-neutral-800 p-6 border border-neutral-700">
            <DialogTitle className="text-xl font-bold text-red-400">
              Delete Account
            </DialogTitle>

            <Description className="mt-2 text-neutral-300">
              This action cannot be undone. This will permanently delete your
              account and all associated data.
            </Description>

            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-neutral-400">
                Type <span className="font-mono text-red-400">CONFIRM</span> to
                continue:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) =>
                  setConfirmationText(e.target.value.toUpperCase())
                }
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Type CONFIRM"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setConfirmationText("");
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-neutral-300 hover:text-white rounded-md border border-neutral-600 hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={!isConfirmed || isDeleting}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  isConfirmed
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
