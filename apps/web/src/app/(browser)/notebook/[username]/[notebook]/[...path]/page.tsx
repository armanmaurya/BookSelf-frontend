import { API_ENDPOINT } from '@/app/utils';
import { WSGIEditor } from '@bookself/slate-editor/editor';
import React from 'react'

type PageResponse = {
    title: string;
    content: string;
}

const Page = async ({
    params
}: {
    params: Promise<{ username: string; notebook: string, path: string[] }>;
}) => {

    const { username, notebook, path } = await params;

    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join('/')}`);

    const data: PageResponse = await res.json();
    console.log(data);
    return (
        <WSGIEditor initialValue={data.content} title={data.title} />
    )
}

export default Page;