import { API_ENDPOINT } from '@/app/utils';
import React from 'react'

const Page = async ({
    params
}: {
    params: Promise<{ username: string; notebook: string, path: string[] }>;
}) => {

    const { username, notebook, path } = await params;

    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}/${path.join('/')}`);

    const data = await res.text();
    console.log(data);
    return (
        <div>{data}</div>
    )
}

export default Page;