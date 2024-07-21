import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export const ThreeDotsMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);
  return (
    <div className="relative">
      <BsThreeDotsVertical className="hover:cursor-pointer" size={23} onClick={handleOpen} />
      {isOpen && (
        <div className="absolute bg-neutral-600 rounded p-1 right-0 mt-1">
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
