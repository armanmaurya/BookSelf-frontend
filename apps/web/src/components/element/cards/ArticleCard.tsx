import { Article } from '@bookself/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { IoMdEye } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";

export const ArticleCard = ({ article }: { article: Article }) => {
  const formattedDate = formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true });

  return (
    <div className="bg-gray-200 dark:bg-[#1E1E1E] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Article Image (16:9 Aspect Ratio) */}
      <div className="w-full aspect-[16/9] overflow-hidden rounded-md">
        <img
          src={article.image_url || "/default-article.jpg"} 
          alt={article.title || "Article Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content (Auto-expand to fill) */}
      <div className="mt-3 flex flex-col flex-grow">
        <div>
          <Link href={`/user/${article.author.username}/article/${article.slug}`}>
            <h2 className="text-lg font-semibold hover:underline text-black dark:text-white line-clamp-2">
              {article.title || "Untitled"}
            </h2>
          </Link>
          <div className="text-sm hover:underline text-gray-600 dark:text-gray-300">
            <Link href={`/user/${article.author.username}`}>
              {article.author.username}
            </Link>
          </div>
        </div>

        {/* Meta Info (Pushed to the bottom) */}
        <div className="flex items-center space-x-2 text-black dark:text-white text-sm mt-auto">
          <div className="flex items-center space-x-1">
            <IoMdEye />
            <span>{article.views}</span>
          </div>
          <span>·</span>
          <div className="flex items-center space-x-1">
            <AiOutlineLike />
            <span>{article.likesCount}</span>
          </div>
          <span>·</span>
          <div className="text-sm">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};
