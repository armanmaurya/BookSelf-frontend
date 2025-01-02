import { API_ENDPOINT } from '@/app/utils';
import React from 'react'

const Page = async ({
    params,
}: {
    params: Promise<{ username: string; notebook: string }>;
}) => {
    const { username, notebook } = await params;

    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}`, );
    const data = await res.text();
    return (
        <div>{data}</div>
    )
}

export default Page;