import { Descendant, Transforms } from "slate";
import RNotification from "../../components/RNotification";
import { MarkdownEditor, WSGIEditor } from "../../components/slate/editor";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NodeType, getData } from "@/app/utils";

export default async function Editor({
  params: { id },
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  // console.log(cookieStore.get("sessionid")?.value);

  if (!cookieStore.get("sessionid")?.value) {
    redirect("/");
  }

  const data = await getData(id, {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: `${cookieStore.get("sessionid")?.name}=${
      cookieStore.get("sessionid")?.value
    }`,
  });

  if (!data.is_owner) {
    redirect("/");
  }

  const editorValue: Descendant[] = [
    {
      type: NodeType.PARAGRAPH,
      align: "left",
      children: [{ text: "" }],
    },
  ];
  const content = data.data.content;
  const jsonContent: Descendant[] = JSON.parse(content) || editorValue;

  return (
    // <MarkdownEditor/>
    <div>
      <RNotification />
      <WSGIEditor initialValue={jsonContent} title={data.data.title === null ? "" : data.data.title} id={id}/>
    </div>
    // <MarkdownPreviewExample/>
  );
}
