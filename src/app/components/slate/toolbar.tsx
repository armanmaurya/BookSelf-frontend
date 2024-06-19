import { SlateCustomEditor } from "./utils";
import { useSlate } from "slate-react";
import { API_ENDPOINT, NodeType } from "@/app/utils";
import Cookies from "js-cookie";

export const SlateToolBar = ({ onSubmit }: { onSubmit: () => {} }) => {
  const editor = useSlate();

  return (
    <div className="flex justify-between border p-3 font-serif">
      <div className="toolbar flex">
        <button
          className={`px-2 hover:bg-slate-100 ${
            SlateCustomEditor.isMarkActive(editor, NodeType.BOLD) ? "bg-slate-100" : ""
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
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isMarkActive(editor, NodeType.ITALIC) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.ITALIC);
          }}
        >
          <em>I</em>
        </button>
        <button
          className="px-2 hover:bg-slate-100"
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleMark(editor, NodeType.UNDERLINE);
          }}
        >
          <u>U</u>
        </button>
        <button
          className="px-2 hover:bg-slate-100"
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.CODE);
          }}
        >
          {"</>"}
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBlockActive(editor, NodeType.H1) ? "bg-slate-100" : ""
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
            SlateCustomEditor.isBlockActive(editor, NodeType.H2) ? "bg-slate-100" : ""
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
            SlateCustomEditor.isBlockActive(editor, NodeType.H3) ? "bg-slate-100" : ""
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
            SlateCustomEditor.isBlockActive(editor, NodeType.H4) ? "bg-slate-100" : ""
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
            SlateCustomEditor.isBlockActive(editor, NodeType.H5) ? "bg-slate-100" : ""
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
            SlateCustomEditor.isBlockActive(editor, NodeType.H6) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBlock(editor, NodeType.H6);
          }}
        >
          H6
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 `}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.setAlignment(editor, "left");
          }}
        >
          left
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 `}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.setAlignment(editor, "center");
          }}
        >
          center
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 `}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.setAlignment(editor, "right");
          }}
        >
          right
        </button>

      </div>
      <div>
        <button
          className="hover:bg-slate-100 bg-sky-600 p-2 rounded-md"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
