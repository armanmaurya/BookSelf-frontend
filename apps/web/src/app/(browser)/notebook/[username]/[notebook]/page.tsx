import { API_ENDPOINT } from "@/app/utils";
import { Button } from "@/components/element/button";
import { NoteBookResponse } from "@bookself/types";
import Image from "next/image";
import Link from "next/link";

const page = async ({ params }: {
  params: Promise<{ username: string; notebook: string }>;
}) => {
  const { username, notebook } = await params;
  const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}`,);
  const data: NoteBookResponse = await res.json();
  return (
    <div className="flex">
      <div className="w-32 sm:w-60">
        <div className="w-full">
          <div className="bg-green-600" style={{ aspectRatio: "5 / 9" }}>
            {/* <img src="https://picsum.photos/200/300.jpg" alt="Book Cover Page" className="rounded-md w-full" style={{ aspectRatio: "5 / 9" }} /> */}
          </div>
          <Link href={`${notebook}/${data.index_page}`} className="w-full absolute bottom-0">
            Read The Book
          </Link>

        </div>
      </div>
      <div className="bg-red-500 flex-grow">
        <h1>{data.name}</h1>
        <p>{data.overview}</p>
      </div>
      <div className="sm:w-60" style={{ aspectRatio: "5 / 9" }}>

      </div>
    </div>
  )
}

export default page;