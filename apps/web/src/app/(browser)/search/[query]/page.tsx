import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { Article } from "@bookself/types";

const Page = async ({ params: { query } }: { params: { query: string } }) => {
  const QUERY = gql`
    query MyQuery($query: String!) {
      articles(query: $query) {
        id
        slug
        title
        views
        createdAt
        likesCount
        status
        author {
          username
          firstName
          lastName
          profilePicture
          isSelf
        }
      }
    }
  `;

  const {
    data,
  }: {
    data: { articles: Article[] };
  } = await createServerClient().query({
    query: QUERY,
    variables: { query },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Search Results for:&nbsp;
          <span className="text-primary-600">&quot;{decodeURIComponent(query)}&quot;</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {data.articles.length} articles found
        </p>
      </div>

      {data.articles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">
            No articles found matching your search
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Try different keywords or check back later
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
