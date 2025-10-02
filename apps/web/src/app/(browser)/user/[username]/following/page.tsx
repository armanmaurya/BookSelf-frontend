import { FollowingBlock } from "@/components/blocks/Following";

interface PageParams {
    params: { username: string };
}

const Page = async ({ params: { username } }: PageParams) => {
    return (
        <div className="relative">
            <div className="pointer-events-none h-screen absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <header className="mb-10 lg:mb-14 flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                            <span className="text-muted-foreground font-medium">@</span>
                            {username}
                            <span className="ml-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                Following
                            </span>
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
                            Accounts that <span className="font-medium">@{username}</span> is currently following. Explore new connections.
                        </p>
                    </div>
                </header>
                    <FollowingBlock username={username} />
            </div>
        </div>
    );
};

export default Page;