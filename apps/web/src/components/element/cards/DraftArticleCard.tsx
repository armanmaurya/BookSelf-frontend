import { Article } from '@bookself/types'
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { IoMdEye } from "react-icons/io";

export const DraftArticleCard = ({
  draftArticle
}: {
  draftArticle: any
}) => {
  const formattedDate = formatDistanceToNow(parseISO(draftArticle.updatedAt), { addSuffix: true });
  return (
    <div className='flex justify-between hover:cursor-pointer bg-neutral-900 p-4 rounded-md w-full'>
      <div>
        <Link href={`/user/${draftArticle.article.author.username}/article/${draftArticle.article.slug}/edit`}>
          <span className='text-3xl font-semibold hover:underline'>{draftArticle.title ? draftArticle.title : "Untitled"}</span>
        </Link>
        <div className='flex items-center space-x-2'>
          <span>Last Edited</span>
          <div className='text-sm'>{formattedDate}</div>
        </div>

      </div>
    </div>
  )
}
