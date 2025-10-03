"use client";
import { ReactPanel } from "@/components/element/panels/panel";
import { ReactPanelGroup } from "@/components/element/panels/panelGroup";
import { ReactPanelResizeHandler } from "@/components/element/panels/PanelResizeHandler";
import { NotebookSidebar } from "@/components/notebook/NotebookSidebar";

interface PageItem {
  id: number;
  title: string;
  slug: string;
  path: string;
  hasChildren: boolean;
  index?: number;
  children?: PageItem[];
  [key: string]: unknown;
}

export const ReadingPanelsLayout = ({
  children,
  username,
  notebook,
  initialPages,
  notebookName,
}: {
  children: React.ReactNode;
  username: string;
  notebook: string;
  initialPages: PageItem[];
  notebookName?: string;
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Main Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ReactPanelGroup direction="horizontal">
          {/* Navigation Panel */}
          <ReactPanel defaultSize={25} minSize={20} maxSize={40}>
            <NotebookSidebar
              mode="read"
              username={username}
              notebook={notebook}
              initialPages={initialPages}
              notebookName={notebookName}
            />
          </ReactPanel>
          
          {/* Resize Handler */}
          <ReactPanelResizeHandler 
            className="w-1 bg-border hover:bg-primary/20 transition-colors"  
          />
          
          {/* Main Content Panel */}
          <ReactPanel defaultSize={75}>
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </ReactPanel>
        </ReactPanelGroup>
      </div>
    </div>
  );
};