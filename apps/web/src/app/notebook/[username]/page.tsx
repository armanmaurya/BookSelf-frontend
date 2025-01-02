import { API_ENDPOINT } from "@/app/utils";
import React from "react";

const User = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}`);
    const data = await res.text();
    return <div>{data}</div>;
};

export default User;
