"use client";
import { useRef, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export const ThreeDotsMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const handleOpen = () => setIsOpen((v) => !v);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <BsThreeDotsVertical
        className="text-gray-400 dark:text-gray-500"
        size={18}
        onClick={handleOpen}
      />
      {isOpen && (
        <div className="absolute top-0 bg-neutral-600 rounded p-2 right-0">
          {children}
        </div>
      )}
    </div>
  );
};

export const MenuItem = ({
  name,
  onClick,
}: {
  name: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div onClick={onClick} className="hover:cursor-pointer">
      {name}
    </div>
  );
};
