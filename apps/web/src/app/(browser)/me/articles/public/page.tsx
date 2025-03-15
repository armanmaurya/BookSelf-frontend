import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";

const Page = async () => {
  const UserArticleQuery = gql`
    query MyQuery {
      me {
        articles {
          slug
          title
          views
          createdAt
          author {
            username
            firstName
            lastName
          }
        }
      }
    }
  `;
  const { data } = await createServerClient().query({
    query: UserArticleQuery,
  });
  return (
    <div className="flex flex-col space-y-2">
      {data.me.articles.map((article: any) => {
        return <ArticleCard article={article} />;
      })}
    </div>
  );
};

export default Page;
