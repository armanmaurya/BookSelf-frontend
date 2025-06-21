import { Article } from '@bookself/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { IoMdEye } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";

export const ArticleCard = ({ article }: { article: Article }) => {
  const formattedDate = formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true });

  return (
    <div className="group bg-white dark:bg-[#1E1E1E] p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-44 relative border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 overflow-hidden">
      {/* Article Content */}
      <div className="flex flex-col flex-grow h-full">
        <div className="mb-3">
          <Link href={`/user/${article.author.username}/article/${article.slug}`}>
            <h2
              className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-800 dark:text-white line-clamp-2 leading-tight pt-1"
              title={article.title || "Untitled Article"}
            >
              {article.title || "Untitled Article"}
            </h2>
          </Link>
          <div className="text-sm mt-1">
            <Link 
              href={`/user/${article.author.username}`}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              by {article.author.username}
            </Link>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1.5">
              <IoMdEye className="text-gray-400 dark:text-gray-500" size={16} />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <AiOutlineLike className="text-gray-400 dark:text-gray-500" size={16} />
              <span>{article.likesCount}</span>
            </div>
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-xs">
            {formattedDate}
          </div>
        </div>
      </div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none" />
    </div>
  );
};