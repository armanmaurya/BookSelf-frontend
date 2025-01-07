"use client";
import { WSGIEditor } from "@bookself/slate-editor/editor";

export const RichTextEditor = ({
  initialValue,
  title,
}: {
  initialValue: string;
  title: string;
}) => {
  return (
    <div>
      <WSGIEditor
        // onChange={(value) => {
        //   console.log(value);
        // }}
        // initialValue={initialValue}
        title={title}
      />
    </div>
  );
};
