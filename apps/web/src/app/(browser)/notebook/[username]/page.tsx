import { API_ENDPOINT } from "@/app/utils";
import { NoContent } from "@/components/blocks/noContent";
import { NewNotebookBtn } from "@/components/blocks/NewNotebookBtn";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  console.log(username);
  const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/  `);
  const data = await res.json();
  return (
    <div className="h-full">
      <NewNotebookBtn username={username} />
      {await data.length == 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <NoContent/>
        </div>
      ) : (
        data.map((notebook: any) => {
          return (
            <div key={notebook.id}>
              <Link href={`${username}/${notebook.slug}`}>{notebook.name}</Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Page;
