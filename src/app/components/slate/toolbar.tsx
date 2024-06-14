import { SlateCustomEditor } from "./utils";
import { useSlate } from "slate-react";
import { API_ENDPOINT } from "@/app/utils";
import Cookies from "js-cookie";

export const SlateToolBar = ({ onSubmit }: { onSubmit: () => {} }) => {
  const editor = useSlate();

  return (
    <div className="flex justify-between border p-3 font-serif">
      <div className="toolbar flex">
        <button
          className={`px-2 hover:bg-slate-100 ${
            SlateCustomEditor.isBoldMarkActive(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleBoldMark(editor);
            // printdata();
          }}
        >
          <strong>B</strong>
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isItalicMarkActive(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleItalicMark(editor);
          }}
        >
          <em>I</em>
        </button>
        <button
          className="px-2 hover:bg-slate-100"
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleUnderlineMark(editor);
          }}
        >
          <u>U</u>
        </button>
        <button
          className="px-2 hover:bg-slate-100"
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleCodeBlock(editor);
          }}
        >
          {"</>"}
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH1Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleH1Block(editor);
          }}
        >
          H1
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH2Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleH2Block(editor);
          }}
        >
          H2
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH3Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleH3Block(editor);
          }}
        >
          H3
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH4Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            console.log("H4");
            SlateCustomEditor.toggleH4Block(editor);
          }}
        >
          H4
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH5Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleH5Block(editor);
          }}
        >
          H5
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH6Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.toggleH6Block(editor);
          }}
        >
          H6
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH6Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.setAlignment(editor, "left");
          }}
        >
          left
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH6Active(editor) ? "bg-slate-100" : ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            SlateCustomEditor.setAlignment(editor, "center");
          }}
        >
          center
        </button>
        <button
          className={`px-2 mx-2 hover:bg-slate-100 ${
            SlateCustomEditor.isH6Active(editor) ? "bg-slate-100" : ""
          }`}
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
