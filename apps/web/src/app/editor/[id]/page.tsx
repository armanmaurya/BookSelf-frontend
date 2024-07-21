
import { Descendant, Transforms } from "slate";
import RNotification from "@/components/RNotification";

import { WSGIEditor } from "@/components/slate/editors/WSGIEditor";
// import { WSGIEditor } from "@repo/slate-editor";

import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { API_ENDPOINT, getData } from "@/app/utils";
import { NodeType } from "@/components/slate/types";
import { Article } from "@/app/types";
import { useCallback } from "react";
import Cookies from "js-cookie";
import { Store } from "react-notifications-component";
import { Editor } from "./editor";



export default async function Page({
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
  if (!data) {
    return notFound();
  }

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
  if (data.data === null) {
    return notFound();
  }
  const content = data.data;
  const jsonContent = content;

  // const DeleteArticle = async () => {
  //   const csrf = Cookies.get("csrftoken");

  //   try {
  //     const res = await fetch(
  //       `${API_ENDPOINT.article.url}?slug=${articleSlug}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-CSRFToken": `${csrf}`,
  //         },
  //         credentials: "include",
  //       }
  //     );
  //     if (res.ok) {
  //       console.log("Article deleted");
  //       const res = await fetch("/api/revalidate?path=/");
  //       const ata = await res.json();
  //       console.log(ata);
  //       action();
  //       window.location.href = "/";
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const UpdateContent = 
    async (body: string) => {
      console.log(body);

      const csrf = Cookies.get("csrftoken");

      // try {
      //   const res = await fetch(
      //     `${API_ENDPOINT.article.url}?slug=${id}`,
      //     {
      //       method: "PATCH",
      //       headers: {
      //         "Content-Type": "application/json",
      //         "X-CSRFToken": `${csrf}`,
      //       },
      //       body: body,
      //       credentials: "include",
      //     }
      //   );
      //   if (res.ok) {
      //     const data: Article = await res.json();
      //     if (data.slug) {
      //       window.history.pushState({}, "", `/editor/${data.slug}`);
      //       // setArticleSlug(data.slug);
      //       const res = await fetch("/api/revalidate?path=/");
      //       const ata = await res.json();
      //       console.log(ata);
      //       // action();
      //     }
      //     console.log("Success");
      //   } else {
      //     console.log("Failed");
      //     Store.addNotification({
      //       title: "Error",
      //       message: "Article upload failed",
      //       type: "danger",
      //       insert: "top",
      //       container: "top-center",
      //       animationIn: ["animate__animated", "animate__fadeIn"],
      //       animationOut: ["animate__animated", "animate__fadeOut"],
      //       dismiss: {
      //         duration: 5000,
      //         // onScreen: true,
      //       },
      //     });
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    }



  return (
    // <MarkdownEditor/>
    <div>
      <RNotification />
      <Editor initialValue={jsonContent} id={id} />
    </div>
    // <MarkdownPreviewExample/>
  );
}
