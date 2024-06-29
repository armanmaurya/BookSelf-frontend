import { ArticleCard } from "@/components/blocks/card";
import { API_ENDPOINT } from "@/app/utils";
// import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

async function search(query: string) {
  try {
    if (query === null || query === undefined || query === "") {
      window.location.href = "/";
    }
    const res = await fetch(`${API_ENDPOINT.search.url}?q=${query}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
}
const Page = async ({ params: { query } }:{ params: { query: string } }) => {
  const data: Promise<Article>[] = await search(query);
  // await new Promise((resolve) => setTimeout(resolve, 9000));

  return (
    <main className="px-2 mt-2">
      <div className="w-full h-full space-y-2 overflow-auto pr-2">
        {data.map(async (articlePromise) => {
          const article = await articlePromise;
          return <ArticleCard key={article.id} data={article} />;
        })}
      </div>
    </main>
  );
};

export default Page;
