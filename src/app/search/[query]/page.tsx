import { ArticleCard } from "@/app/components/articleCard";
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
    const res = await fetch(`http://127.0.0.1:8000/api/search?q=${query}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
}
const Page = async ({ params: { query } }: { params: { query: string } }) => {
    const data: Promise<Article>[] = await search(query);

  return (
    <main className="px-2 mt-2">
      <div className="flex space-x-2">
        {data.map(async (articlePromise) => {
          const article = await articlePromise;
          return <ArticleCard key={article.id} data={article} />;
        })}
      </div>
    </main>
  );
};

export default Page;
