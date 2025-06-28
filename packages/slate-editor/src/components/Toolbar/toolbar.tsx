import { SlateCustomEditor } from "../../utils";
import { useSlate } from "slate-react";
import { NodeType } from "../../types";
import { useEffect, useRef, useState } from "react";

// ------------ Icons ------------
import { FaLink, FaQuoteLeft, FaCode, FaListUl } from "react-icons/fa";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaImage,
  FaAlignJustify,
} from "react-icons/fa6";
import { IoMdCode, IoIosArrowDown } from "react-icons/io";
import { ToolbarButton } from "./toolBarButton";

import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";

import { motion, AnimatePresence } from "framer-motion";

import { MdFormatListNumbered } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiTabs } from "react-icons/pi";
import { ParagraphEditor, AdjustFontSize } from "@bookself/slate-paragraph";
import { ListEditor } from "@bookself/slate-list";
import { Editor, Element, Transforms } from "slate";
import { CodeEditor } from "@bookself/slate-code";
import { HeadingEditor, HeadingType } from "@bookself/slate-heading";

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

export const SlateToolBar = () => {
  const editor = useSlate();
  const [alignment, setAlignment] = useState<string>("left");
  const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <div
      className="z-10 pt-3"
      // onMouseDown={(e) => {
      //   e.preventDefault();
      // }}
    >
      <div className="w-full border justify-between rounded-full bg-slate-100 dark:bg-neutral-700 bg-opacity-80 backdrop-blur-sm flex">
        <div
          className="toolbar flex space-x-1 px-2 m-1"
          // onMouseDown={(e) => {
          //   e.preventDefault();
          // }}
        >
          <ToolbarButton
            onClick={() => SlateCustomEditor.toggleMark(editor, NodeType.BOLD)}
            isActive={SlateCustomEditor.isMarkActive(editor, NodeType.BOLD)}
          >
            <strong>B</strong>
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              SlateCustomEditor.toggleMark(editor, NodeType.ITALIC)
            }
            isActive={SlateCustomEditor.isMarkActive(editor, NodeType.ITALIC)}
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              SlateCustomEditor.toggleMark(editor, NodeType.UNDERLINE)
            }
            isActive={SlateCustomEditor.isMarkActive(
              editor,
              NodeType.UNDERLINE
            )}
          >
            <u>U</u>
          </ToolbarButton>

          <ToolbarButton
            isActive={SlateCustomEditor.isMarkActive(editor, NodeType.CODE)}
            onClick={() => SlateCustomEditor.toggleMark(editor, NodeType.CODE)}
          >
            <IoMdCode size={20} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              SlateCustomEditor.toggleHeading(editor, HeadingType.H1);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H1}
          >
            <LuHeading1 size={23} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const text = ParagraphEditor.string(editor);
              SlateCustomEditor.toggleHeading(editor, HeadingType.H2);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H2}
          >
            <LuHeading2 size={23} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const text = ParagraphEditor.string(editor);
              SlateCustomEditor.toggleHeading(editor, HeadingType.H3);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H3}
          >
            <LuHeading3 size={23} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const text = ParagraphEditor.string(editor);
              SlateCustomEditor.toggleHeading(editor, HeadingType.H4);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H4}
          >
            <LuHeading4 size={23} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const text = ParagraphEditor.string(editor);
              SlateCustomEditor.toggleHeading(editor, HeadingType.H5);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H5}
          >
            <LuHeading5 size={23} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const text = ParagraphEditor.string(editor);
              SlateCustomEditor.toggleHeading(editor, HeadingType.H6);
            }}
            isActive={HeadingEditor.getHeadingType(editor) === HeadingType.H6}
          >
            <LuHeading6 size={23} />
          </ToolbarButton>
          {/* <ToolbarButton
            onClick={() => {
              if (CodeEditor.isBlockActive(editor)) {
                const text = CodeEditor.text(editor);
                Transforms.removeNodes(editor, {
                  match: (n) => Element.isElement(n) && n.type === NodeType.CODE,
                  mode: "highest"
                });
                ParagraphEditor.insertParagraph(editor, {}, text);
              } else {

                CodeEditor.insertCode(editor, NodeType.PARAGRAPH);
              }
            }}
            isActive={SlateCustomEditor.isBlockActive(editor, NodeType.CODE)}
          >
            <FaCode />
          </ToolbarButton> */}
          {/* <ToolbarButton
            isActive={SlateCustomEditor.isBlockActive(
              editor,
              NodeType.BLOCKQUOTE
            )}
            onClick={() => {
              // SlateCustomEditor.toggleBlock(editor, NodeType.BLOCKQUOTE);
              SlateCustomEditor.toggleBlockQuote(editor);
            }}
          >
            <FaQuoteLeft />
          </ToolbarButton> */}

          {/* <ToolbarButton
            isActive={SlateCustomEditor.isBlockActive(editor, NodeType.LINK)}
            onClick={() => {
              const url = prompt("Enter the URL of the link:");
              SlateCustomEditor.insertLink(editor, url);
            }}
          >
            <FaLink />
          </ToolbarButton> */}
          <div
            className={`flex relative items-center justify-center hover:cursor-pointer`}
            onClick={(event) => {
              event.preventDefault();
              setIsDropDownActive(!isDropDownActive);
            }}
          >
            <div
              className={`flex space-x-1 p-1 rounded dark:bg-opacity-15 bg-opacity-15  ${
                isDropDownActive ? "dark:bg-neutral-400 bg-neutral-400" : ""
              }`}
            >
              <AlignIconSwitcher
                align={`${SlateCustomEditor.getAlignment(editor)}`}
              />
              <div
                className={`${
                  isDropDownActive ? "-rotate-180" : "rotate-0"
                } transition transform-gpu`}
              >
                <IoIosArrowDown />
              </div>
            </div>
            <div
              className={`${
                isDropDownActive ? "" : "hidden"
              } absolute shadow-lg border rounded-md flex items-center dark:bg-neutral-800 bg-white justify-center top-7 left-0`}
            >
              <ToolbarButton
                onClick={() => {
                  ParagraphEditor.alignNode(editor, "left");
                  setIsDropDownActive(false);
                }}
                isActive={`${ParagraphEditor.getAlignment(editor)}` === "left"}
              >
                <FaAlignLeft className="my-0.5" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  ParagraphEditor.alignNode(editor, "center");
                  setIsDropDownActive(false);
                }}
                isActive={
                  `${ParagraphEditor.getAlignment(editor)}` === "center"
                }
              >
                <FaAlignCenter className="my-0.5" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  ParagraphEditor.alignNode(editor, "right");
                  setIsDropDownActive(false);
                }}
                isActive={`${ParagraphEditor.getAlignment(editor)}` === "right"}
              >
                <FaAlignRight className="my-0.5" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  ParagraphEditor.alignNode(editor, "justify");
                  setIsDropDownActive(false);
                }}
                isActive={
                  `${ParagraphEditor.getAlignment(editor)}` === "justify"
                }
              >
                <FaAlignJustify className="my-0.5" />
              </ToolbarButton>
            </div>
          </div>

          {/* <ToolbarButton
            onClick={() => {
              // toggleList(editor, NodeType.ORDERED_LIST);
              if (editor.selection) {
                const currentNode = Editor.node(editor, editor.selection)
                if (currentNode[0].type === NodeType.PARAGRAPH) {
                  // ListEditor.initializeList(editor, NodeType.ORDERED_LIST)

                }
              }
            }}
          >
            <MdFormatListNumbered size={20} />
          </ToolbarButton> */}
          {/* <ToolbarButton
            onClick={() => {
              if (editor.selection) {
                const currentNode = Editor.node(editor, editor.selection)
                if (currentNode[0].type === NodeType.PARAGRAPH) {
                  // ListEditor.initializeList(editor, NodeType.UNORDERED_LIST)

                }
              }
            }}
          >
            <FaListUl size={20} />
          </ToolbarButton> */}
          {/* <ToolbarButton
            onClick={() => {
              SlateCustomEditor.insertImage(editor);
            }}
          >
            <FaImage size={20} />
          </ToolbarButton> */}
          {/* <ToolbarButton onClick={() => {
            SlateCustomEditor.insertTabs(editor);
          }}>
            <PiTabs size={25} />
          </ToolbarButton> */}
          {/* <AdjustFontSize /> */}
        </div>
        <div className="">
          <div
            ref={ref}
            className="hover:cursor-pointer h-full flex items-center px-1.5"
            onClick={() => {
              setIsOpened(!isOpened);
            }}
          >
            <BsThreeDotsVertical size={20} />
          </div>
          <AnimatePresence>
            {isOpened && (
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.1 }}
                className={`absolute right-5 mt-4 h-80 w-52 border rounded-md bg-white dark:bg-neutral-800`}
              >
                <button
                  className="h-12 hover:bg-red-500 w-full border"
                  // onClick={onDelete}
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
