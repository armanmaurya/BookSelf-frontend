"use client";
import { API_ENDPOINT } from "@/app/utils";
import { WSGIEditor } from "@bookself/slate-editor/editor";

export const RichTextEditor = ({
  initialValue,
  title,
  username,
  notebook,
  path,
}: {
  initialValue: string;
  title: string;
  username: string;
  notebook: string;
  path: string[];
}) => {
  const updatePage = async (value: string) => {
    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: value,
      }),
    })
    if (res.ok) {
      console.log("Updated page");
    }
  }
  console.log("initialValue", initialValue);
  return (
    <div>
      <WSGIEditor
        onChange={(value) => {
          updatePage(value);
        }}
        initialValue={initialValue}
        title={title}
      />
    </div>
  );
};
