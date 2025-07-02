"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export const ShareButton = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-0 lg:ml-2">
            {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this collection</DialogTitle>
          <DialogDescription>
            Copy the link below or share it with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 border rounded px-2 py-1 text-sm bg-muted"
            onFocus={(e) => e.target.select()}
          />
          <Button size="sm" onClick={handleCopy}>
            Copy
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
