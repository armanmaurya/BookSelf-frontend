import { SlateCustomEditor } from "./utils";
import { useSlate } from "slate-react";
import { API_ENDPOINT, NodeType } from "@/app/utils";
import Cookies from "js-cookie";
import { useState } from "react";

export const SlateToolBar = ({  onDelete }: { onDelete:() => {} }) => {
  const editor = useSlate();
  const [currentImage, setCurrentImage] = useState<string>(
    "https://img.icons8.com/?size=100&id=8195&format=png&color=000000"
  );
  const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div
      className="flex justify-between border space-x-1 font-serif  p-1 px-3 m-2 mx-4 rounded-full"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <div
        className="toolbar flex space-x-1"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <button
          className={`px-2 rounded ${
            SlateCustomEditor.isMarkActive(editor, NodeType.BOLD)
              ? "bg-blue-100"
              : "hover:bg-slate-100"
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.BOLD);
            // printdata();
          }}
        >
          <strong>B</strong>
        </button>
        <button
          className={`px-2 rounded hover:bg-slate-100 ${
            SlateCustomEditor.isMarkActive(editor, NodeType.ITALIC)
              ? "bg-blue-100"
              : "hover:bg-slate-100"
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.ITALIC);
          }}
        >
          <em>I</em>
        </button>
        <button
          className={`px-2 rounded hover:bg-slate-100 ${
            SlateCustomEditor.isMarkActive(editor, NodeType.UNDERLINE)
              ? "bg-blue-100"
              : "hover:bg-slate-100"
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.UNDERLINE);
          }}
        >
          <u>U</u>
        </button>
        <button
          className={`px-2 rounded hover:bg-slate-100 ${
            SlateCustomEditor.isMarkActive(editor, NodeType.CODE)
              ? "bg-blue-100"
              : "hover:bg-slate-100"
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.CODE);
          }}
        >
          {"<>"}
        </button>
        <button
          className={`px-2 rounded hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H1)
              ? "bg-blue-100"
              : "hover:bg-slate-100"
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H1);
          }}
        >
          H1
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H2)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H2);
          }}
        >
          H2
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H3)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H3);
          }}
        >
          H3
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H4)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            console.log("H4");
            SlateCustomEditor.toggleBlock(editor, NodeType.H4);
          }}
        >
          H4
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H5)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H5);
          }}
        >
          H5
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H6)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H6);
          }}
        >
          H6
        </button>
        <div
          className="flex relative items-center justify-center hover:cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            setIsDropDownActive(!isDropDownActive);
          }}
        >
          <div className="flex space-x-1 hover:bg-slate-100 p-1 rounded">
            <img src={currentImage} width="18px" alt="" />
            <img
              src="https://img.icons8.com/?size=100&id=39786&format=png&color=000000"
              className="w-4"
              alt=""
            />
          </div>
          <div
            className={`${
              isDropDownActive ? "" : "hidden"
            } absolute shadow-lg border rounded-md w-24 flex items-center justify-center top-6 bg-white space-x-2 p-1 left-0`}
          >
            <button
              className={`hover:bg-slate-100 p-1 rounded-sm`}
              onClick={(event) => {
                event.preventDefault();
                SlateCustomEditor.setAlignment(editor, "left");
                setCurrentImage(
                  "https://img.icons8.com/?size=100&id=8195&format=png&color=000000"
                );
                setIsDropDownActive(false);
              }}
            >
              <img
                src="https://img.icons8.com/?size=100&id=8195&format=png&color=000000"
                // width="22px"
                alt=""
              />
            </button>
            <button
              className={`hover:bg-slate-100 p-1 rounded-sm`}
              onClick={(event) => {
                event.preventDefault();
                SlateCustomEditor.setAlignment(editor, "center");
                setCurrentImage(
                  "https://img.icons8.com/?size=100&id=8140&format=png&color=000000"
                );
                setIsDropDownActive(false);
              }}
            >
              <img
                src="https://img.icons8.com/?size=100&id=8140&format=png&color=000000"
                // width="22px"
                alt=""
              />
            </button>
            <button
              className={`hover:bg-slate-100 p-1 rounded-sm`}
              onClick={(event) => {
                event.preventDefault();
                SlateCustomEditor.setAlignment(editor, "right");
                setCurrentImage(
                  "https://img.icons8.com/?size=100&id=8147&format=png&color=000000"
                );
                setIsDropDownActive(false);
              }}
            >
              <img
                src="https://img.icons8.com/?size=100&id=8147&format=png&color=000000"
                // width="22px"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="relative">
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              setIsOpened(!isOpened);
            }}
          >
            Click
          </div>
          <div
            className={`${
              isOpened ? "" : "hidden"
            } absolute right-0  border h-96 rounded w-52 bg-white`}
          >
            <button className="h-12 hover:bg-red-500 w-full border" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
