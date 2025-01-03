import { API_ENDPOINT } from "@/app/utils";
import React from "react";
import { NoContent } from "@/components/blocks/noContent";

const User = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const res = await fetch(`${API_ENDPOINT.article.url}/${username}`);
  const data = await res.json();
  console.log(data.length);
  return (
    <div className="h-full">
      {data.length == 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <NoContent/>
        </div>
      ) : (
        data.map((notebook: any) => {
          return (
            <div key={notebook.id}>
              <a href={`/${username}/${notebook.name}`}>{notebook.name}</a>
            </div>
          );
        })
      )}
    </div>
  );
};

export default User;
