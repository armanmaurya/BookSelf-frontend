import { NotebookSidebar } from "@/components/notebook/NotebookSidebar";

import type { NotebookSidebarInitialPage } from "@/components/notebook/NotebookSidebar";

export interface ReadingSidebarProps {
  username: string;
  notebook: string;
  initialPages: NotebookSidebarInitialPage[];
  notebookName?: string;
}

export const ReadingSidebar: React.FC<ReadingSidebarProps> = (props) => (
  <NotebookSidebar mode="read" {...props} />
);