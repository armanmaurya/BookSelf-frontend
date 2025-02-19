import React from 'react'
import { Editor } from './editor'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_ENDPOINT } from '@/app/utils';
import { Article } from '@/app/types';

const Page = async ({
    params
}: {
    params: Promise<{ username: string, article: string }>
}) => {
    const { username, article } = await params;
    console.log("username", username);
    console.log("article", article);
    const cookieStore = cookies();

    if (!cookieStore.get("sessionid")?.value) {
        redirect("/");
    }

    const res = await fetch(`${API_ENDPOINT.article.url}?slug=${article}`)

    if (!res.ok) {
        redirect("/");
    }

    const data: Article = await res.json();


    return (
        <div className=''>
            {/* <RNotification /> */}
            <Editor content={data.content} title={data.title} slug={article} />
        </div>
    )
}

export default Page