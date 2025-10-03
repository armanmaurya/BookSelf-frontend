"use client";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaBookOpen, 
  FaPlus,
} from "react-icons/fa";
import { NotebookCard } from "@/components/notebook/NotebookCard";

interface Notebook {
  id: string;
  name: string;
  overview?: string;
  cover?: string;
  pagesCount?: number;
  hasPages: boolean;
  slug: string;
  createdAt: string;
  indexPage?: {
    id: string;
    index: number;
    path: string;
    slug: string;
    title: string;
    updatedAt: string;
    hasChildren: boolean;
    createdAt: string;
  };
  user: {
    firstName: string;
    username: string;
    lastName: string;
    isSelf: boolean;
    id: string;
    profilePicture?: string;
  };
}

interface UserBooksProps {
  username: string;
  isSelf: boolean;
}

export const UserBooks = ({ username, isSelf }: UserBooksProps) => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "recent" | "popular">("all");

  // Updated GraphQL query for notebooks
  const NOTEBOOKS_QUERY = gql`
    query GetUserNotebooks($username: String!) {
      user(username: $username) {
        notebooks {
          cover
          createdAt
          hasPages
          id
          name
          overview
          pagesCount
          slug
          indexPage {
            id
            index
            path
            slug
            title
            updatedAt
            hasChildren
            createdAt
          }
          user {
            firstName
            username
            lastName
            isSelf
            id
            profilePicture
          }
        }
      }
    }
  `;

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        setLoading(true);
        // Real API call for notebooks
        const { data } = await client.query({
          query: NOTEBOOKS_QUERY,
          variables: { username },
        });
        setNotebooks(data.user.notebooks || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load notebooks");
        setLoading(false);
      }
    };

    fetchNotebooks();
  }, [username]);

  const filteredNotebooks = notebooks.filter(notebook => {
    switch (filter) {
      case "recent":
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(notebook.createdAt) > oneWeekAgo;
      case "popular":
        return notebook.pagesCount && (notebook.pagesCount || 0) > 0;
      default:
        return true;
    }
  });

  const getFilterLabel = (filterKey: string) => {
    switch (filterKey) {
      case "recent": return "Recent";
      case "popular": return "Popular";
      default: return "All";
    }
  };

  const getFilterCount = (filterKey: string) => {
    switch (filterKey) {
      case "recent":
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return notebooks.filter(n => new Date(n.createdAt) > oneWeekAgo).length;
      case "popular":
        return notebooks.filter(n => n.hasPages && (n.pagesCount || 0) > 0).length;
      default:
        return notebooks.length;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Notebooks</h2>
          {notebooks.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filteredNotebooks.length} of {notebooks.length} notebooks
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
        {/* Create New Notebook Button */}
        {isSelf && (
            <Button asChild className="gap-2 shrink-0">
                <Link href={`/new/notebook`}>
                    <FaPlus className="h-4 w-4" />
                    <span>New Notebook</span>
                </Link>
            </Button>
        )}
          
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All", count: getFilterCount("all") },
              { key: "recent", label: "Recent", count: getFilterCount("recent") },
              { key: "popular", label: "Popular", count: getFilterCount("popular") },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
                  ${filter === key 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                {label}
                {count > 0 && (
                  <span className={`text-xs ${filter === key ? "text-primary-foreground/80" : "text-muted-foreground/60"}`}>
                    ({count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>      {/* Notebooks grid */}
      {filteredNotebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotebooks.map((notebook, index) => (
            <NotebookCard key={notebook.id} notebook={notebook} index={index} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FaBookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filter === "all" 
                ? (isSelf ? "No notebooks in your collection yet" : `${username} hasn't created any notebooks yet`)
                : `No ${getFilterLabel(filter).toLowerCase()} notebooks`
              }
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {filter === "all"
                ? (isSelf 
                    ? "Start organizing your thoughts and ideas by creating your first notebook."
                    : "This user hasn't started creating notebooks yet."
                  )
                : `No notebooks match the ${getFilterLabel(filter).toLowerCase()} filter.`
              }
            </p>
            {isSelf && (
              <Button className="gap-2">
                <FaPlus className="h-4 w-4" />
                Create Notebook
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};