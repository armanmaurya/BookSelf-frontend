
const Page = async ({ params }: {
    params: Promise<{ username: string, article: string }>
}) => {
    const { username, article } = await params;
    console.log("username", username);
    console.log("article", article);
    return (
        <div className="">Article Page</div>
    )
}

export default Page;