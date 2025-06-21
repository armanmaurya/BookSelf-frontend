import { ArticleCard } from "@/components/element/cards/ArticleCard";
import { DraftArticleCard } from "@/components/element/cards/DraftArticleCard";
import { createServerClient } from "@/lib/ServerClient";
import { gql } from "@apollo/client";
import { Article } from "@bookself/types";

const Page = async () => {
  const DraftArticleOverviewQuery = gql`
    query MyQuery {
      draftArticles {
        ... on DraftArticleList {
          __typename
          articles {
            updatedAt
            title
            article {
              slug
              author {
                username
              }
            }
          }
        }
      }
    }
  `;
  const { data } = await createServerClient().query({
    query: DraftArticleOverviewQuery,
  });
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold">Draft Articles</h1>
      {data.draftArticles.articles.map((draftArticle: any) => {
        return <DraftArticleCard draftArticle={draftArticle} />;
      })}
    </div>
  );
};

export default Page;
