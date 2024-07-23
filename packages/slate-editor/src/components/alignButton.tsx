// import { ToolbarButton } from "@/components/element/button";
import { FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { ToolbarButton } from "./Toolbar/toolBarButton";
import { useState } from "react";
export const AlignButton = ({
  align,
  onAlign,
}: {
  align: string;
  onAlign: (align: "left" | "center" | "right") => void;
}) => {
  const AlignIconSwitcher = ({ align }: { align: string }) => {
    switch (align) {
      case "left":
        return <FaAlignLeft />;
      case "center":
        return <FaAlignCenter />;
      case "right":
        return <FaAlignRight />;
      default:
        return <FaAlignLeft />;
    }
  };
  const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);

  return (
    <div
      className={`flex relative items-center justify-center hover:cursor-pointer`}
      onClick={(event) => {
        event.preventDefault();
        setIsDropDownActive(!isDropDownActive);
      }}
    >
      <div className="w-full flex flex-row-reverse">
        <div
          className={`flex space p-1 rounded dark:bg-opacity-15 bg-opacity-15  ${
            isDropDownActive ? "dark:bg-neutral-400 bg-neutral-400" : ""
          }`}
        >
          <AlignIconSwitcher align={`${align}`} />
          <div
            className={`${
              isDropDownActive ? "-rotate-180" : "rotate-0"
            } transition transform-gpu`}
          >
            <IoIosArrowDown />
          </div>
        </div>
      </div>
      <div
        className={`${
          isDropDownActive ? "" : "hidden"
        } absolute shadow-lg border rounded-md z-10 w-24 flex items-center dark:bg-neutral-800 bg-white justify-center top-7 left-0`}
      >
        <ToolbarButton
          onClick={() => {
            // SlateCustomEditor.setAlignment(editor, "left");
            onAlign("left");
            setIsDropDownActive(false);
          }}
          //   isActive={`${SlateCustomEditor.getAlignment(editor)}` === "left"}
        >
          <FaAlignLeft className="my-0.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            // SlateCustomEditor.setAlignment(editor, "center");
            onAlign("center");
            setIsDropDownActive(false);
          }}
          //   isActive={`${SlateCustomEditor.getAlignment(editor)}` === "center"}
        >
          <FaAlignCenter className="my-0.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            // SlateCustomEditor.setAlignment(editor, "right");
            onAlign("right");
            setIsDropDownActive(false);
          }}
          //   isActive={`${SlateCustomEditor.getAlignment(editor)}` === "right"}
        >
          <FaAlignRight className="my-0.5" />
        </ToolbarButton>
      </div>
    </div>
  );
};
