import { Article } from '@bookself/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { IoMdEye } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { FiBookmark } from "react-icons/fi";

export const ArticleCard = ({ article }: { article: Article }) => {
  const formattedDate = formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true });

  return (
    <div className="group bg-white dark:bg-[#1E1E1E] p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-44 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 overflow-hidden">
      {/* Status Badge (optional - for drafts/pinned/etc) */}
      {article.status === "draft" && (
        <span className="absolute top-3 left-3 bg-yellow-100 dark:bg-yellow-900/80 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          Draft
        </span>
      )}

      {/* Article Content */}
      <div className="flex flex-col flex-grow h-full">
        <div className="mb-3">
          <Link href={`/user/${article.author.username}/article/${article.slug}`}>
            <h2
              className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-800 dark:text-white line-clamp-2 leading-tight"
              title={article.title || "Untitled Article"}
            >
              {article.title || "Untitled Article"}
            </h2>
          </Link>
          <div className="flex items-center mt-2">
            <Link 
              href={`/user/${article.author.username}`}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2">
                {article.author.profilePicture ? (
                  <img 
                    src={article.author.profilePicture} 
                    alt={article.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-xs">
                    {article.author.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              {article.author.username}
            </Link>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center space-x-1.5">
              <IoMdEye className="text-gray-400 dark:text-gray-500" size={16} />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <AiOutlineLike className="text-gray-400 dark:text-gray-500" size={16} />
              <span>{article.likesCount}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-gray-400 dark:text-gray-500 text-xs">
              {formattedDate}
            </div>
            <button 
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Save article"
            >
              <FiBookmark size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity pointer-events-none" />
    </div>
  );
};