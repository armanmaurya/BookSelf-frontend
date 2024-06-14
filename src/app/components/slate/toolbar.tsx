import { Editor } from "slate";
import { CustomEditor } from "./utils";
import { useSlate } from "slate-react";

export const SlateToolBar = () => {
  const editor = useSlate();
  //   console.log("editor", editor.operations);
  //   editor.onChange = (value) => {
  //     console.log("Changed");
  //   };
  const printdata = () => {
    console.log("editor", JSON.stringify(editor.children));
  }
  return (
    <div className="toolbar flex border p-3 font-serif">
      <button
        className={`px-2 hover:bg-slate-100 ${
          CustomEditor.isBoldMarkActive(editor) ? "bg-slate-100" : ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          // CustomEditor.toggleBoldMark(editor);
          printdata();
        }}
      >
        <strong>B</strong>
      </button>
      <button
        className={`px-2 mx-2 hover:bg-slate-100 ${
          CustomEditor.isItalicMarkActive(editor) ? "bg-slate-100" : ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
      >
        <em>I</em>
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          // CustomEditor.toggleUnderlineMark(editor);
        }}
      >
        <u>U</u>
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleCodeBlock(editor);
        }}
      >
        {"</>"}
      </button>
      <button
        className={`px-2 mx-2 hover:bg-slate-100 ${
          CustomEditor.isH1Active(editor) ? "bg-slate-100" : ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleH1Block(editor);
        }}
      >
        H1
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleH2Block(editor);
        }}
      >
        H2
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleH3Block(editor);
        }}
      >
        H3
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          console.log("H4");
          CustomEditor.toggleH4Block(editor);
        }}
      >
        H4
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleH5Block(editor);
        }}
      >
        H5
      </button>
      <button
        className="px-2 hover:bg-slate-100"
        onClick={(event) => {
          event.preventDefault();
          CustomEditor.toggleH6Block(editor);
        }}
      >
        H6
      </button>
    </div>
  );
};
