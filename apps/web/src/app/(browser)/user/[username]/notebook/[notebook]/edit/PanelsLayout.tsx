"use client";
import { useState } from "react";
import { NotebookSidebar } from "@/components/notebook/NotebookSidebar";
import { NotebookSidebarToggle } from "@/components/notebook/NotebookSidebarToggle";
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="h-full flex flex-col">
            {/* Main Panel Layout */}
            <div className="flex-1 overflow-hidden">
                {/* Desktop Layout - Sidebar pushes content */}
                <div className="hidden lg:flex h-full">
                    {/* Sidebar - Slides in/out and pushes content */}
                    <div 
                        className={`
                            h-full min-h-screen border-r bg-card overflow-hidden
                            transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? 'w-80' : 'w-0'}
                        `}
                    >
                        <div className={`w-80 h-full transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            <NotebookSidebar
                                mode="edit"
                                username={username}
                                notebook={notebook}
                                initialPages={initialPages}
                            />
                        </div>
                    </div>
                    
                    {/* Main Content - Adjusts width based on sidebar state */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>

                {/* Mobile Layout - Sidebar as overlay */}
                <div className="lg:hidden h-full relative">
                    {/* Main Content */}
                    <div className="h-full overflow-y-auto">
                        {children}
                    </div>

                    {/* Backdrop - Only on mobile when sidebar is open */}
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 top-14 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
                            onClick={closeSidebar}
                        />
                    )}

                    {/* Sidebar Overlay - Only on mobile */}
                    <div 
                        className={`
                            fixed top-14 bottom-0 left-0 z-40 w-80 max-w-[85vw]
                            transform transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        `}
                    >
                        <NotebookSidebar
                            mode="edit"
                            username={username}
                            notebook={notebook}
                            initialPages={initialPages}
                            onMobileClose={closeSidebar}
                        />
                    </div>
                </div>

                {/* Floating Hamburger Toggle Button */}
                <NotebookSidebarToggle 
                    isOpen={isSidebarOpen} 
                    onToggle={toggleSidebar} 
                />
            </div>
        </div>
    )
}
