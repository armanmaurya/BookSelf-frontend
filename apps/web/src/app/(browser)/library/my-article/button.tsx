"use client"
import { API_ENDPOINT } from "@/app/utils";
import Cookies from "js-cookie";

export const DeleteButton = ({ slug }: { slug: string }) => {

    const DeleteArticle = async () => {
        const csrf = Cookies.get("csrftoken");
      
        try {
          const res = await fetch(
            `${API_ENDPOINT.article.url}?slug=${slug}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": `${csrf}`,
              },
              credentials: "include",
            }
          );
          if (res.ok) {
            console.log("Article deleted");
            const res = await fetch("/api/revalidate?path=/");
            const ata = await res.json();
            console.log(ata);
            // window.location.href = "/";
            window.location.reload()
          }
        } catch (error) {
          console.log(error);
        }
      };
    return (
        <button onClick={DeleteArticle} className="bg-red-400 rounded-md p-2 absolute right-2 top-2">
            Delete
        </button>
    )
}