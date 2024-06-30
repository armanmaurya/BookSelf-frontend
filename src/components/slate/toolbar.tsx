import { SlateCustomEditor } from "./utils";
import { useSlate } from "slate-react";
import { API_ENDPOINT } from "@/app/utils";
import { NodeType } from "./types";
import Cookies from "js-cookie";
import { useState } from "react";

export const SlateToolBar = ({ onDelete }: { onDelete: () => {} }) => {
  const editor = useSlate();
  const [currentImage, setCurrentImage] = useState<string>(
    "https://img.icons8.com/?size=100&id=8195&format=png&color=000000"
  );
  const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div
      className="flex justify-between border space-x-1  p-1 px-3 m-2 mx-4 rounded-full"
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
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.QUOTE)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.QUOTE);
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-black w-5 h-5"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M2 12.3501H7.79999C9.32999 12.3501 10.38 13.5101 10.38 14.9301V18.1501C10.38 19.5701 9.32999 20.7301 7.79999 20.7301H4.58002C3.16002 20.7301 2 19.5701 2 18.1501V12.3501"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
              ></path>{" "}
              <path
                d="M2 12.35C2 6.29998 3.13003 5.30003 6.53003 3.28003"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
              ></path>{" "}
              <path
                d="M13.6299 12.3501H19.4299C20.9599 12.3501 22.0099 13.5101 22.0099 14.9301V18.1501C22.0099 19.5701 20.9599 20.7301 19.4299 20.7301H16.2099C14.7899 20.7301 13.6299 19.5701 13.6299 18.1501V12.3501"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
              ></path>{" "}
              <path
                d="M13.6299 12.35C13.6299 6.29998 14.7599 5.30003 18.1599 3.28003"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
              ></path>{" "}
            </g>
          </svg>
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H6)
              ? "bg-slate-100"
              : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            const url = prompt("Enter the URL of the link:");
            SlateCustomEditor.insertLink(editor, url);
          }}
        >
          link
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
            <button
              className="h-12 hover:bg-red-500 w-full border"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
