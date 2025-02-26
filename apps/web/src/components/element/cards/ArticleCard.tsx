import { Article } from '@bookself/types'
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { IoMdEye } from "react-icons/io";

export const ArticleCard = ({
  article
}: {
  article: Article
}) => {
  const formattedDate = formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true });
  return (
    <div className='flex justify-between hover:cursor-pointer bg-neutral-900 p-4 rounded-md w-full'>
      <div>
        <Link href={`/user/${article.author.username}/article/${article.slug}`}>
          <span className='text-3xl font-semibold hover:underline'>{article.title ? article.title : "Untitled"}</span>
        </Link>
        <div className='flex flex-col space-y-1 pt-0.5'>
          <div className='flex space-x-1.5'>
            <div className='text-sm hover:underline'><Link href={`/user/${article.author.username}`}>
              {article.author.username}
            </Link></div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <IoMdEye />
              <span>{article.views}</span>
            </div>
            <span>·</span>
            <div className='text-sm'>{formattedDate}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
