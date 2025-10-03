"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { API_ENDPOINT } from "@/app/utils";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import type { PageResponse } from "@bookself/types";
import {
  BookOpen,
  Check,
  ChevronRight,
  Edit3,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export type SidebarMode = "read" | "edit";

export interface NotebookSidebarPage {
  id: number;
  title: string;
  slug: string;
  path: string;
  hasChildren: boolean;
  children?: NotebookSidebarPage[];
}

export interface NotebookSidebarRawPage {
  id?: number | string;
  title?: string;
  slug?: string;
  path?: string;
  hasChildren?: boolean;
  has_children?: boolean;
  children?: NotebookSidebarRawPage[];
  [key: string]: unknown;
}

export type NotebookSidebarInitialPage =
  | NotebookSidebarPage
  | PageResponse
  | NotebookSidebarRawPage;

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

const UPDATE_PAGE_MUTATION = gql`
  mutation UpdatePage(
    $notebookSlug: String!
    $pagePath: String!
    $title: String!
  ) {
    updatePage(
      notebookSlug: $notebookSlug
      pagePath: $pagePath
      title: $title
    ) {
      ... on PageType {
        hasChildren
        id
        index
        path
        slug
        title
        children {
          hasChildren
          id
          path
          slug
          title
        }
      }
    }
  }
`;

const DELETE_PAGE_MUTATION = gql`
  mutation DeletePage($notebookSlug: String!, $pagePath: String!) {
    deletePage(notebookSlug: $notebookSlug, pagePath: $pagePath) {
      ... on NotebookDeleteSuccess {
        __typename
        message
        success
      }
      ... on NotebookAuthenticationError {
        __typename
        message
      }
      ... on NotebookPermissionError {
        __typename
        message
      }
    }
  }
`;

const PAGE_QUERY = gql`
  query SidebarPages($notebookSlug: String!, $parentId: Int) {
    pages(notebookSlug: $notebookSlug, parentId: $parentId) {
      hasChildren
      id
      index
      path
      slug
      title
      children {
        hasChildren
        id
        path
        slug
        title
      }
    }
  }
`;

const normalizePage = (
  page: NotebookSidebarInitialPage
): NotebookSidebarPage => {
  const record = page as NotebookSidebarRawPage & Partial<PageResponse>;
  const idValue =
    typeof record?.id === "string" ? parseInt(record.id, 10) : record?.id;
  const rawChildren: NotebookSidebarInitialPage[] = Array.isArray(
    record?.children
  )
    ? (record.children as NotebookSidebarInitialPage[])
    : [];
  const children = rawChildren.map(normalizePage);

  return {
    id: idValue ?? 0,
    title: record?.title ?? record?.slug ?? "Untitled",
    slug: record?.slug ?? "",
    path: record?.path ?? record?.slug ?? "",
    hasChildren: Boolean(
      record?.hasChildren ?? record?.has_children ?? children.length > 0
    ),
    children,
  };
};

const normalizePages = (
  pages: NotebookSidebarInitialPage[]
): NotebookSidebarPage[] => pages.map(normalizePage);

const flattenPath = (segments: string[]): string =>
  segments.filter(Boolean).join("/");

const getNotebookUrl = (
  username: string,
  notebook: string,
  mode: SidebarMode
) => `/user/${username}/notebook/${notebook}/${mode}`;

const getActivePath = (pathname: string): string[] =>
  pathname.split("/").slice(6).filter(Boolean);

const useInitialAnimation = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return enabled;
};

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className="flex items-center gap-1 px-1 md:px-2 py-1 md:py-1.5 rounded-md bg-muted/20 relative"
      style={{ paddingLeft: `${level * 16 + 8}px` }}
    >
      {level > 0 && (
        <div 
          className="absolute top-0 bottom-0 w-px bg-border/40"
          style={{ left: `${(level - 1) * 16 + 16}px` }}
        />
      )}
      {level > 0 && (
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-px bg-border/40"
          style={{ left: `${(level - 1) * 16 + 16}px` }}
        />
      )}
      <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground shrink-0" />
      <Input
        ref={inputRef}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
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

interface PageTreeItemProps {
  item: NotebookSidebarPage;
  username: string;
  notebook: string;
  path: string[];
  activePath: string[];
  notebookUrl: string;
  level: number;
  mode: SidebarMode;
  onRefresh: () => void;
  parentRefresh?: () => void;
  loadChildren?: (parentId: number) => Promise<NotebookSidebarPage[]>;
}

const PageTreeItem: React.FC<PageTreeItemProps> = ({
  item,
  username,
  notebook,
  path,
  activePath,
  notebookUrl,
  level,
  mode,
  onRefresh,
  parentRefresh,
  loadChildren,
}) => {
  const isEditMode = mode === "edit";
  const currentPath = flattenPath(path);
  const isActive = activePath[activePath.length - 1] === item.slug;
  const isInActivePath = activePath.includes(item.slug);

  const isFirstMount = useRef(true);
  const hasManuallyToggled = useRef(false);
  const prevActivePath = useRef<string[]>([]);
  const enableAnimation = useInitialAnimation();

  const [isExpanded, setIsExpanded] = useState(
    isInActivePath && item.hasChildren
  );
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const [showingChildNewPage, setShowingChildNewPage] = useState(false);
  const [children, setChildren] = useState<NotebookSidebarPage[]>(
    item.children ?? []
  );
  const [hasLoadedChildren, setHasLoadedChildren] = useState(
    (item.children ?? []).length > 0
  );
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const displayHasChildren =
    item.hasChildren || children.length > 0 || showingChildNewPage;

  const fetchChildren = useCallback(async () => {
    if (!isEditMode || !loadChildren) {
      return;
    }

    setIsLoadingChildren(true);
    try {
      const fetchedChildren = await loadChildren(item.id);
      setChildren(fetchedChildren);
      setHasLoadedChildren(true);
    } catch (error) {
      console.error("Failed to load page children:", error);
    } finally {
      setIsLoadingChildren(false);
    }
  }, [isEditMode, loadChildren, item.id]);

  useEffect(() => {
    const nextChildren = item.children ?? [];
    if (nextChildren.length > 0) {
      setChildren(nextChildren);
      setHasLoadedChildren(true);
    }
  }, [item.children]);

  useEffect(() => {
    const activePathChanged =
      JSON.stringify(prevActivePath.current) !== JSON.stringify(activePath);

    if (isFirstMount.current) {
      if (isInActivePath && item.hasChildren) {
        setIsExpanded(true);
      }
      isFirstMount.current = false;
      prevActivePath.current = [...activePath];
      return;
    }

    if (!activePathChanged) {
      return;
    }

    if (isInActivePath && item.hasChildren && !hasManuallyToggled.current) {
      setIsExpanded(true);
    }

    prevActivePath.current = [...activePath];
  }, [activePath, isInActivePath, item.hasChildren]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditMode, isRenaming]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (isExpanded && !hasLoadedChildren && !isLoadingChildren) {
      void fetchChildren();
    }
  }, [
    isEditMode,
    isExpanded,
    hasLoadedChildren,
    isLoadingChildren,
    fetchChildren,
  ]);

  const handleToggle = () => {
    if (!displayHasChildren) {
      return;
    }

    hasManuallyToggled.current = true;
    setIsExpanded((prev) => !prev);
  };

  const handleRename = async () => {
    if (!isEditMode) {
      return;
    }

    if (newTitle.trim() && newTitle !== item.title) {
      try {
        const { data, errors } = await client.mutate({
          mutation: UPDATE_PAGE_MUTATION,
          variables: {
            notebookSlug: notebook,
            pagePath: `/${currentPath}`,
            title: newTitle.trim(),
          },
        });

        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        }

        if (data?.updatePage) {
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

  const handleDeleteConfirm = async () => {
    if (!isEditMode) {
      return;
    }

    setIsDeleting(true);
    try {
      const { data, errors } = await client.mutate({
        mutation: DELETE_PAGE_MUTATION,
        variables: {
          notebookSlug: notebook,
          pagePath: `/${currentPath}`,
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      const result = data?.deletePage;
      
      if (result?.__typename === "NotebookDeleteSuccess" && result.success) {
        setShowDeleteDialog(false);
        parentRefresh?.();
        if (isActive) {
          const parentPath = path.slice(0, -1);
          router.push(`${notebookUrl}/${flattenPath(parentPath)}`);
        }
      } else if (result?.__typename === "NotebookAuthenticationError") {
        console.error("Authentication error:", result.message);
      } else if (result?.__typename === "NotebookPermissionError") {
        console.error("Permission error:", result.message);
      } else {
        console.error("Failed to delete page: Unknown error");
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    if (!isEditMode) {
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleCreateChildPage = async (title: string) => {
    if (!isEditMode) {
      return;
    }

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
        await fetchChildren();
        onRefresh();
        setIsExpanded(true);
        router.push(`${notebookUrl}/${currentPath}/${data.createPage.slug}`);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
    setShowingChildNewPage(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      void handleRename();
    } else if (event.key === "Escape") {
      setIsRenaming(false);
      setNewTitle(item.title);
    }
  };

  const startRename = () => {
    if (!isEditMode) {
      return;
    }
    setIsRenaming(true);
  };

  const startNewChildPage = () => {
    if (!isEditMode || showingChildNewPage) {
      return;
    }
    setShowingChildNewPage(true);
    hasManuallyToggled.current = true;
    setIsExpanded(true);
  };

  return (
    <div className="select-none relative">
      {/* Vertical connector line */}
      {level > 0 && (
        <div 
          className="absolute top-0 bottom-0 w-px bg-border/40"
          style={{ left: `${(level - 1) * 16 + 16}px` }}
        />
      )}
      
      <div
        className={cn(
          "group relative flex items-center gap-1 px-1 md:px-2 py-1 md:py-1.5 rounded-md transition-colors",
          isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
        )}
        style={{ 
          paddingLeft: `${level * 16 + 8}px`
        }}
        onDoubleClick={isEditMode ? startRename : undefined}
      >
        {/* Horizontal connector line */}
        {level > 0 && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-px bg-border/40"
            style={{ left: `${(level - 1) * 16 + 16}px` }}
          />
        )}
        {displayHasChildren ? (
          <button
            onClick={handleToggle}
            className="flex h-3 w-3 md:h-4 md:w-4 items-center justify-center rounded hover:bg-muted/50 transition-colors shrink-0"
          >
            <ChevronRight
              className={cn(
                "h-2 w-2 md:h-3 md:w-3",
                enableAnimation &&
                  "transition-transform duration-200 ease-in-out",
                isExpanded && "rotate-90"
              )}
            />
          </button>
        ) : (
          <div className="w-3 md:w-4" />
        )}

        <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground shrink-0" />

        <div className="flex-1 min-w-0">
          {isEditMode && isRenaming ? (
            <Input
              ref={inputRef}
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="h-6 py-0 px-1 text-sm border-0 shadow-none focus-visible:ring-1"
            />
          ) : (
            <Link
              href={`${notebookUrl}/${currentPath}`}
              className="block truncate text-sm hover:underline"
              title={item.title}
            >
              {item.title}
            </Link>
          )}
        </div>

        {isEditMode && (
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
        )}
      </div>

      {!isEditMode && children.length > 0 && (
        <div
          className={cn(
            "grid overflow-hidden relative",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            enableAnimation &&
              "transition-[grid-template-rows] duration-200 ease-in-out"
          )}
        >
          <div className="overflow-hidden">
            {children.map((child) => (
              <PageTreeItem
                key={child.id}
                item={child}
                username={username}
                notebook={notebook}
                path={[...path, child.slug]}
                activePath={activePath}
                notebookUrl={notebookUrl}
                level={level + 1}
                mode={mode}
                onRefresh={onRefresh}
                parentRefresh={parentRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {isEditMode && (
        <div
          className={cn(
            "grid overflow-hidden",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            enableAnimation &&
              "transition-[grid-template-rows] duration-200 ease-in-out"
          )}
        >
          <div className="overflow-hidden ml-2">
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
                  mode={mode}
                  onRefresh={fetchChildren}
                  parentRefresh={onRefresh}
                  loadChildren={loadChildren}
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
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.title}"? This action cannot be undone.
              {displayHasChildren && " All child pages will also be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface NotebookSidebarProps {
  mode: SidebarMode;
  username: string;
  notebook: string;
  initialPages: NotebookSidebarInitialPage[];
  notebookName?: string;
}

export const NotebookSidebar: React.FC<NotebookSidebarProps> = ({
  mode,
  username,
  notebook,
  initialPages,
  notebookName,
}) => {
  const isEditMode = mode === "edit";
  const pathname = usePathname();
  const router = useRouter();
  const [showingNewRootPage, setShowingNewRootPage] = useState(false);
  const [pages, setPages] = useState<NotebookSidebarPage[]>(
    normalizePages(initialPages ?? [])
  );
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const notebookUrl = useMemo(
    () => getNotebookUrl(username, notebook, mode),
    [username, notebook, mode]
  );
  const activePath = useMemo(() => getActivePath(pathname), [pathname]);

  const loadChildren = useCallback(
    async (parentId: number) => {
      const { data } = await client.query({
        query: PAGE_QUERY,
        variables: {
          notebookSlug: notebook,
          parentId,
        },
        fetchPolicy: "network-only",
      });

      const fetched = normalizePages(data?.pages ?? []);
      return fetched.map((child) => ({
        ...child,
        children: child.children ?? [],
      }));
    },
    [notebook]
  );

  const loadRootPages = useCallback(async () => {
    if (!isEditMode) {
      return;
    }

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

      setPages(normalizePages(data?.pages ?? []));
    } catch (error) {
      console.error("Failed to load notebook pages:", error);
    } finally {
      setIsLoadingPages(false);
    }
  }, [isEditMode, notebook]);

  useEffect(() => {
    setPages(normalizePages(initialPages ?? []));
  }, [initialPages]);

  useEffect(() => {
    if (isEditMode && initialPages.length === 0) {
      void loadRootPages();
    }
  }, [isEditMode, initialPages.length, loadRootPages]);

  const handleCreateRootPage = async (title: string) => {
    if (!isEditMode) {
      return;
    }

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
        router.push(`${notebookUrl}/${data.createPage.slug}`);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
    setShowingNewRootPage(false);
  };

  const startNewRootPage = () => {
    if (!isEditMode || showingNewRootPage) {
      return;
    }
    setShowingNewRootPage(true);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r overflow-hidden">
      <div className="flex items-center gap-3 p-3 md:p-4 border-b bg-muted/20 shrink-0">
        <BookOpen className="h-5 w-5 text-primary" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">
            {notebookName || "Notebook"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isEditMode ? "Manage pages" : "Browse notebook pages"}
          </p>
        </div>
        {isEditMode && (
          <Button
            size="sm"
            variant="outline"
            onClick={startNewRootPage}
            className="gap-1 md:gap-2 px-2 md:px-3"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        )}
      </div>

      {isEditMode && (
        <div className="px-3 md:px-4 py-2 text-xs text-muted-foreground bg-muted/10 border-b shrink-0 hidden md:block">
          Double-click a page to rename it, or use the menu for more actions.
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide p-1 md:p-2 min-h-0">
        {isEditMode && isLoadingPages ? (
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
                mode={mode}
                onRefresh={isEditMode ? loadRootPages : () => undefined}
                parentRefresh={isEditMode ? loadRootPages : undefined}
                loadChildren={isEditMode ? loadChildren : undefined}
              />
            ))}

            {isEditMode && showingNewRootPage && (
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
            {isEditMode ? (
              !showingNewRootPage ? (
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
              )
            ) : (
              <>
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No pages in this notebook
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {!isEditMode && (
        <div className="p-2 md:p-3 border-t bg-muted/10 shrink-0">
          <Link
            href={`/user/${username}/notebook/${notebook}/read`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors block"
          >
            <span className="hidden md:inline">←</span> Back to overview
          </Link>
        </div>
      )}
    </div>
  );
};
