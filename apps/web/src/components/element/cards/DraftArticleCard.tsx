import { DraftArticle } from "@bookself/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { IoMdEye, IoMdTime } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";

export const DraftArticleCard = ({
  draftArticle,
  href,
}: {
  draftArticle: DraftArticle;
  href: string;
}) => {
  const formattedDate = formatDistanceToNow(parseISO(draftArticle.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start gap-3">
        <div>
          <Link
            href={href}
            className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
          >
            {draftArticle.article.title || "Untitled Draft"}
          </Link>
          
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <IoMdTime className="mr-1.5" size={14} />
            <span>Last edited {formattedDate}</span>
          </div>
        </div>
        
        <Link
          href={href}
          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="Edit draft"
        >
          <FiEdit2 size={18} />
        </Link>
      </div>
      
      {/* {draftArticle.article.excerpt && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {draftArticle.article.excerpt}
        </p>
      )} */}
    </div>
  );
};