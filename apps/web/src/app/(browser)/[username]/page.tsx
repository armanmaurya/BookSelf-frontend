import React from 'react'
import { API_ENDPOINT } from '@/app/utils';

const AllNoteBookPage = async () => {
    const res = await fetch(`${API_ENDPOINT.article.url}`);
    const data = await res.text();
    return (
        <div>{data}</div>
    )
}

export default AllNoteBookPage;
