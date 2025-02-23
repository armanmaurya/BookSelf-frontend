"use client";
import { ReactPanel } from "@/components/element/panels/panel";
import { ReactPanelGroup } from "@/components/element/panels/panelGroup";
import { ReactPanelResizeHandler } from "@/components/element/panels/PanelResizeHandler";
import { NoteBookNavBar } from "./NoteBookNavBar";
import { MenuProvider } from "@bookself/context-menu";
import { PageResponse } from "@bookself/types";



export const PanelsLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ReactPanelGroup direction="horizontal">
            <ReactPanel defaultSize={30} minSize={15}>
                <MenuProvider>
                    <NoteBookNavBar/>
                </MenuProvider>
            </ReactPanel>
            <ReactPanelResizeHandler className="bg-white" style={{ width: "1px" }} />
            <ReactPanel defaultSize={70}>
                {children}
            </ReactPanel>
        </ReactPanelGroup>
    )
}
