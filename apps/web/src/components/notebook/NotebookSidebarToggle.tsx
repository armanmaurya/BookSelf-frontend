"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NotebookSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const NotebookSidebarToggle: React.FC<NotebookSidebarToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <Button
      variant="default"
      size="icon"
      onClick={onToggle}
      className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </Button>
  );
};
