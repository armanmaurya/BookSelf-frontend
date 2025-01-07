"use client";
import { Panel } from "@/components/element/panels/panel";
import { PanelGroup } from "@/components/element/panels/panelGroup";
import { PanelResizeHandler } from "@/components/element/panels/PanelResizeHandler";
import { NoteBookNavBar } from "./NoteBookNavBar";

export const PanelsLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30} minSize={15}>
                <NoteBookNavBar />
            </Panel>
            <PanelResizeHandler className="bg-white" style={{ width: "1px"}} />
            <Panel defaultSize={70}>
                {children}
            </Panel>
        </PanelGroup>
    )
}
