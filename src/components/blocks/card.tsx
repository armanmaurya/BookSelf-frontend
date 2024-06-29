import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

export const ArticleCard = ({ data }: { data: Article }) => {
  return (
    <div className="border rounded-md w-full flex flex-col justify-center h-24 p-4 shadow-md">
      <Link href={`/article/${data.id}`}>
        <h1 className="text-2xl font-bold">{data.title || "Untitled"}</h1>
      </Link>
      <div className="flex justify-between w-full">
        <p className="text-sm">Author: {data.author}</p>
        <p className="text-sm">
          {new Date(data.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export const ArticleCard2 = ({ data }: { data: Article }) => {
  return (
    <div className="flex flex-col rounded-md border w-1/3 h-96 shadow-md">
      <Image
        src="https://picsum.photos/200/300"
        alt=""
        className="w-full rounded hover:cursor-pointer"
        style={{ height: "216px" }}
        width={200}
      />
      <div className="p-2">
        <h1 className="text-3xl font-bold text-black">{data.title}</h1>
        <div className="flex justify-between w-full">
          <p className="text-sm">Author: {data.author}</p>
          <p className="text-sm">
            Created At:{" "}
            {new Date(data.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {/* <p className="text-sm text-slate-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est fugit
          deleniti esse quod placeat doloremque voluptas perferendis temporibus
          et cum qui excepturi autem{" "}
        </p> */}
      </div>
    </div>
  );
};
