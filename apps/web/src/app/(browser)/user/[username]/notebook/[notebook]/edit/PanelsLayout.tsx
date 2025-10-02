"use client";
import { ReactPanel } from "@/components/element/panels/panel";
import { ReactPanelGroup } from "@/components/element/panels/panelGroup";
import { ReactPanelResizeHandler } from "@/components/element/panels/PanelResizeHandler";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { PageResponse } from "@bookself/types";

export const PanelsLayout = ({
    children,
    username,
    notebook,
    initialPages,
}: {
    children: React.ReactNode;
    username: string;
    notebook: string;
    initialPages: PageResponse[];
}) => {
    return (
        <div className="h-full flex flex-col">
            {/* Main Panel Layout */}
            <div className="flex-1 overflow-hidden">
                <ReactPanelGroup direction="horizontal">
                    {/* Navigation Panel */}
                    <ReactPanel defaultSize={25} minSize={20} maxSize={40}>
                        <EnhancedSidebar 
                            username={username} 
                            notebook={notebook} 
                            initialPages={initialPages}
                        />
                    </ReactPanel>
                    
                    {/* Resize Handler */}
                    <ReactPanelResizeHandler 
                        className="w-1 bg-border hover:bg-primary/20 transition-colors" 
                    />
                    
                    {/* Main Content Panel */}
                    <ReactPanel defaultSize={75}>
                        <div className="h-full">
                            {children}
                        </div>
                    </ReactPanel>
                </ReactPanelGroup>
            </div>
        </div>
    )
}
