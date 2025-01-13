import { API_ENDPOINT } from '@/app/utils';
import { NoContent } from '@/components/blocks/noContent';
import { RenderContent } from '@bookself/slate-editor/renderer';
import { PageResponse } from '@bookself/types';
import { redirect } from 'next/navigation';
import React from 'react'
import { Descendant } from 'slate';

const page = async ({
  params,
}: {
  params: Promise<{ username: string; notebook: string; path: string[] }>;
}) => {
  const { username, notebook, path } = await params;

  if (!path) {

    const getIndexPage = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}?index`);
    const data: PageResponse = await getIndexPage.json();
    redirect(`/${username}/notebook/${notebook}/${data.slug}`);
  }

  const res = await fetch(
    `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join("/")}`
  );

  const data: PageResponse = await res.json();

  return (
    <div className='h-full'>
      <RenderContent value={data.content} title={data.title}>
        <div className='h-full flex justify-center items-center'>
          <NoContent height={400} />
        </div>
      </RenderContent>
    </div>
  )
}

export default page