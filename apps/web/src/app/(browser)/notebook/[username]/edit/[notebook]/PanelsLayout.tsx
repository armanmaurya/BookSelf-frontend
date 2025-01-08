"use client";
import { Panel } from "@/components/element/panels/panel";
import { PanelGroup } from "@/components/element/panels/panelGroup";
import { PanelResizeHandler } from "@/components/element/panels/PanelResizeHandler";
import { NoteBookNavBar } from "./NoteBookNavBar";
import { MenuProvider } from "@bookself/context-menu";
import { PageResponse } from "@bookself/types";



export const PanelsLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30} minSize={15}>
                <MenuProvider>
                    <NoteBookNavBar/>
                </MenuProvider>
            </Panel>
            <PanelResizeHandler className="bg-white" style={{ width: "1px" }} />
            <Panel defaultSize={70}>
                {children}
            </Panel>
        </PanelGroup>
    )
}
