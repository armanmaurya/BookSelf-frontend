"use client";
import { API_ENDPOINT } from "@/app/utils";
import { ContextMenu, ContextMenuItem, useContextMenu } from "@bookself/context-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { HiDotsVertical } from "react-icons/hi";

export const YourNoteBooksView = ({ data, username }: { data: any, username: string }) => {
    const contextMenu = useContextMenu<any>();
    const router = useRouter();
    console.log(data);

    const handleClick = (e: any, notebook: any) => {
        e.preventDefault();
        e.stopPropagation();
        contextMenu.setClicked(true);
        contextMenu.setPoint({ x: e.clientX, y: e.clientY });
        contextMenu.setData({ notebook });
    }

    const routeToIndexPage = async () => {
        const getIndexPage = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${contextMenu.data.notebook.slug}?index`);
        const data = await getIndexPage.json();
        nProgress.start();
        router.push(`notebook/${contextMenu.data.notebook.slug}/edit/${data.slug}`);
    }
    return (
        <div>
            {data.map((notebook: any) => {
                return (
                    <div key={notebook.id} className="p-2 border rounded-md m-2 flex items-center justify-between hover-div" onContextMenu={(e) => handleClick(e, notebook)}>
                        <Link href={`notebook/${notebook.slug}/read/${notebook.index ? notebook.index : ""}`}>{notebook.name}</Link>
                        <div className="color-change-div" onClick={(e) => handleClick(e, notebook)}>
                            <HiDotsVertical />
                        </div>
                    </div>
                );
            })}
            <ContextMenu>
                <ContextMenuItem onClick={routeToIndexPage}>
                    Edit
                </ContextMenuItem>
            </ContextMenu>
        </div>
    );
};
