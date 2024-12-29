import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

export const YourProfileButton = async () => {
    const cookieStore = cookies();

    interface Response {
        username: string
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/getusername`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: `${cookieStore.get("sessionid")?.name}=${
                cookieStore.get("sessionid")?.value
            }`,
        },
    })

    if (res.ok) {
        const data: Response = await res.json();
        return (
            <Link href={`${data.username}`}>
                Your Profile
            </Link>
        )
    } else {
        return (
            <Link href="/signup">
                Create
            </Link>
        )
    }

    return (
        <Link href="/account/personal-info">
            Your Profile
        </Link>
    )
}
