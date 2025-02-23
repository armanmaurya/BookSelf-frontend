import { API_ENDPOINT } from "@/app/utils";
import { NoContent } from "@/components/blocks/noContent";
import { NewNotebookBtn } from "@/components/blocks/NewNotebookBtn";
import Link from "next/link";
import { ContextMenu, ContextMenuItem, MenuProvider } from "@bookself/context-menu";
import { YourNoteBooksView } from "./YourNoteBooksView";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  console.log(username);
  const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/  `);
  let data = await res.json();

  const modifyData = async () => {
    data = await Promise.all(
      data.map(async (notebook: any) => {
        const getIndexPage = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook.slug}?index`);
        const indexPage = await getIndexPage.json();
        return {
          ...notebook,
          index: indexPage.slug,
        };
      })
    );
  };

  await modifyData();
  
  return (
    <div className="h-full w-96">
      <MenuProvider>
        <NewNotebookBtn username={username} />
        {await data.length == 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <NoContent />
          </div>
        ) : (
          // data.map((notebook: any) => {
          //   return (
          //     <div key={notebook.id} className="p-2 border rounded-md m-2">
          //       <Link href={`notebook/${notebook.slug}`}>{notebook.name}</Link>
          //     </div>
          //   );
          // })
          <YourNoteBooksView data={data} username={username} />
        )}


      </MenuProvider>
    </div>
  );
};

export default Page;
