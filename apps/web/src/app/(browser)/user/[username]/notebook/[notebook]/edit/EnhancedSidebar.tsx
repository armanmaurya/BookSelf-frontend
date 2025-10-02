"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_ENDPOINT } from "@/app/utils";
import { PageResponse } from "@bookself/types";
import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

const CREATE_PAGE_MUTATION = gql`
  mutation CreatePage($notebookSlug: String!, $path: String!, $title: String!) {
    createPage(notebookSlug: $notebookSlug, path: $path, title: $title) {
      ... on PageType {
        id
        slug
      }
    }
  }
`;

const PAGE_QUERY = gql`
  query MyQuery($notebookSlug: String!, $parentId: Int) {
    pages(notebookSlug: $notebookSlug, parentId: $parentId) {
      hasChildren
      id
      index
      path
      slug
      title
    }
  }
`;

interface PageTreeItemProps {
  item: PageResponse;
  username: string;
  notebook: string;
  path: string[];
  activePath: string[];
  notebookUrl: string;
  level: number;
  onRefresh: () => void;
  parentRefresh?: () => void;
}

const NewPageInput: React.FC<{
  level: number;
  onCancel: () => void;
  onCreate: (title: string) => void;
  placeholder?: string;
}> = ({ level, onCancel, onCreate, placeholder = "New page..." }) => {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (title.trim()) {
      onCreate(title.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-muted/20"
      style={{ paddingLeft: `${level * 12 + 20}px` }}
    >
      <FileText className="h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className="h-6 py-0 px-1 text-sm border-0 shadow-none focus-visible:ring-1"
        placeholder={placeholder}
      />
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={handleSubmit}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={onCancel}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const PageTreeItem: React.FC<PageTreeItemProps> = ({
  item,
  username,
  notebook,
  path,
  activePath,
  notebookUrl,
  level,
  onRefresh,
  parentRefresh,
}) => {
  const currentPath = path.join("/");
  const isActive = activePath[activePath.length - 1] === item.slug;
  const isInActivePath = activePath.includes(item.slug);
  
  // Track if this is the first mount to handle initial expansion
  const isFirstMount = useRef(true);
  // Track if user has manually toggled expansion (to prevent auto-collapse)
  const hasManuallyToggled = useRef(false);
  
  // Initialize expansion state based on whether this page is in the active path (only on first mount)
  const [isExpanded, setIsExpanded] = useState(isInActivePath && item.has_children);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const [showingChildNewPage, setShowingChildNewPage] = useState(false);
  const [children, setChildren] = useState<PageResponse[]>(item.children || []);
  const [hasLoadedChildren, setHasLoadedChildren] = useState(!!(item.children && item.children.length > 0));
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const displayHasChildren =
    item.has_children || children.length > 0 || showingChildNewPage;

  const loadChildren = useCallback(async () => {
    // Check if we have pre-fetched data first
    if (item.children && item.children.length > 0) {
      setChildren(item.children);
      setHasLoadedChildren(true);
      return;
    }

    // Otherwise fetch from API
    setIsLoadingChildren(true);
    try {
      const { data } = await client.query({
        query: PAGE_QUERY,
        variables: {
          notebookSlug: notebook,
          parentId: item.id,
        },
        fetchPolicy: "network-only",
      });

      const nextChildren = ((data?.pages ?? []) as any[]).map((page) => ({
        ...page,
        id: typeof page.id === 'string' ? parseInt(page.id, 10) : page.id,
        has_children: page.hasChildren,
        children: [],
      })) as PageResponse[];
      setChildren(nextChildren);
      setHasLoadedChildren(true);
    } catch (error) {
      console.error("Failed to load page children:", error);
    } finally {
      setIsLoadingChildren(false);
    }
  }, [item.id, item.children, notebook]);

  // Sync children when item.children changes (from server-side pre-fetch)
  useEffect(() => {
    if (item.children && item.children.length > 0) {
      setChildren(item.children);
      setHasLoadedChildren(true);
    }
  }, [item.children]);

  // Expand if this page is in the active path (only on first mount, don't auto-collapse later)
  useEffect(() => {
    if (isFirstMount.current && isInActivePath && item.has_children) {
      setIsExpanded(true);
    }
    isFirstMount.current = false;
  }, [isInActivePath, item.has_children]);

  // Only auto-expand/collapse if user hasn't manually toggled
  useEffect(() => {
    // Skip if user has manually toggled or this is the first mount
    if (hasManuallyToggled.current || isFirstMount.current) {
      return;
    }
    
    // Don't change expansion state based on activePath changes after first mount
  }, [isInActivePath]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Load children when expanded if not already loaded
  useEffect(() => {
    if (isExpanded && !hasLoadedChildren && !isLoadingChildren) {
      void loadChildren();
    }
  }, [isExpanded, hasLoadedChildren, isLoadingChildren, loadChildren]);

  const handleRename = async () => {
    if (newTitle.trim() && newTitle !== item.title) {
      try {
        const response = await fetch(
          `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${currentPath}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTitle.trim() }),
          }
        );

        if (response.ok) {
          onRefresh();
          parentRefresh?.();
        }
      } catch (error) {
        console.error("Failed to rename page:", error);
        setNewTitle(item.title);
      }
    }
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Delete "${item.title}"? This action cannot be undone.${
          displayHasChildren ? " All child pages will also be deleted." : ""
        }`
      )
    ) {
      try {
        const response = await fetch(
          `${API_ENDPOINT.notebook.url}/${username}/${notebook}/${currentPath}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          parentRefresh?.();
          if (isActive) {
            const parentPath = path.slice(0, -1);
            router.push(`${notebookUrl}/${parentPath.join("/")}`);
          }
        }
      } catch (error) {
        console.error("Failed to delete page:", error);
      }
    }
  };

  const handleCreateChildPage = async (title: string) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_PAGE_MUTATION,
        variables: {
          notebookSlug: notebook,
          path: `/${currentPath}`,
          title,
        },
      });

      if (data?.createPage?.slug) {
        await loadChildren();
        onRefresh();
        setIsExpanded(true);
        // Navigate to the newly created page
        router.push(`${notebookUrl}/${currentPath}/${data.createPage.slug}`);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
    setShowingChildNewPage(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewTitle(item.title);
    }
  };

  const startRename = () => {
    setIsRenaming(true);
  };

  const startNewChildPage = () => {
    if (showingChildNewPage) return;
    setShowingChildNewPage(true);
    hasManuallyToggled.current = true;
    setIsExpanded(true);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
          isActive && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onDoubleClick={startRename}
      >
        {/* Expand/Collapse Button */}
        {displayHasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => {
              hasManuallyToggled.current = true;
              setIsExpanded((prev) => !prev);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        {!displayHasChildren && <div className="w-4" />}

        {/* Icon */}
        {displayHasChildren ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <Input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="h-6 py-0 px-1 text-sm border-0 shadow-none focus-visible:ring-1"
            />
          ) : (
            <Link
              href={`${notebookUrl}/${currentPath}`}
              className="block truncate text-sm hover:underline"
            >
              {item.title}
            </Link>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={startNewChildPage}>
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={startRename}>
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {isExpanded && (
        <div className="ml-2">
          {isLoadingChildren && (
            <p className="px-3 py-1 text-xs text-muted-foreground">
              Loading...
            </p>
          )}

          {!isLoadingChildren &&
            children.map((child) => (
              <PageTreeItem
                key={child.id}
                item={child}
                username={username}
                notebook={notebook}
                path={[...path, child.slug]}
                activePath={activePath}
                notebookUrl={notebookUrl}
                level={level + 1}
                onRefresh={loadChildren}
                parentRefresh={onRefresh}
              />
            ))}

          {showingChildNewPage && (
            <NewPageInput
              level={level + 1}
              onCancel={() => setShowingChildNewPage(false)}
              onCreate={handleCreateChildPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface EnhancedSidebarProps {
  username: string;
  notebook: string;
  initialPages: PageResponse[];
}

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  username,
  notebook,
  initialPages,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showingNewRootPage, setShowingNewRootPage] = useState(false);
  const [pages, setPages] = useState<PageResponse[]>(initialPages);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const notebookUrl = `/user/${username}/notebook/${notebook}/edit`;
  const pathArray = pathname.split("/");
  const activePath = pathArray.slice(6).filter(Boolean);

  const loadRootPages = useCallback(async () => {
    setIsLoadingPages(true);
    try {
      const { data } = await client.query({
        query: PAGE_QUERY,
        variables: {
          notebookSlug: notebook,
          parentId: null,
        },
        fetchPolicy: "network-only",
      });

      const nextPages = ((data?.pages ?? []) as any[]).map((page) => ({
        ...page,
        id: typeof page.id === 'string' ? parseInt(page.id, 10) : page.id,
        has_children: page.hasChildren,
        children: [],
      })) as PageResponse[];
      setPages(nextPages);
    } catch (error) {
      console.error("Failed to load notebook pages:", error);
    } finally {
      setIsLoadingPages(false);
    }
  }, [notebook]);

  // Sync pages state with initialPages when it changes
  useEffect(() => {
    if (initialPages.length > 0) {
      setPages(initialPages);
    }
  }, [initialPages]);

  // Only fetch on client if initialPages is empty
  useEffect(() => {
    if (initialPages.length === 0) {
      void loadRootPages();
    }
  }, [initialPages.length, loadRootPages]);

  const handleCreateRootPage = async (title: string) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_PAGE_MUTATION,
        variables: {
          notebookSlug: notebook,
          path: "/",
          title,
        },
      });

      if (data?.createPage?.slug) {
        await loadRootPages();
        // Navigate to the newly created page
        router.push(`${notebookUrl}/${data.createPage.slug}`);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
    setShowingNewRootPage(false);
  };

  const startNewRootPage = () => {
    if (showingNewRootPage) return;
    setShowingNewRootPage(true);
  };

  return (
    <div className="h-full flex flex-col bg-card/30">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Pages</h3>
          <Button size="sm" variant="outline" onClick={startNewRootPage}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Double-click to rename, right-click for options
        </p>
      </div>

      {/* Page Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
        {isLoadingPages ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Loading pages...
          </div>
        ) : pages.length > 0 ? (
          <div className="space-y-1">
            {pages.map((page) => (
              <PageTreeItem
                key={page.id}
                item={page}
                username={username}
                notebook={notebook}
                path={[page.slug]}
                activePath={activePath}
                notebookUrl={notebookUrl}
                level={0}
                onRefresh={loadRootPages}
              />
            ))}

            {showingNewRootPage && (
              <NewPageInput
                level={0}
                onCancel={() => setShowingNewRootPage(false)}
                onCreate={handleCreateRootPage}
                placeholder="New page title..."
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {!showingNewRootPage ? (
              <>
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <h4 className="font-medium text-foreground mb-1">
                  No pages yet
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by creating your first page
                </p>
                <Button size="sm" onClick={startNewRootPage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Page
                </Button>
              </>
            ) : (
              <div className="w-full">
                <NewPageInput
                  level={0}
                  onCancel={() => setShowingNewRootPage(false)}
                  onCreate={handleCreateRootPage}
                  placeholder="First page title..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
