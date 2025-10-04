"use client";
import { gql } from "@apollo/client";
import { useEffect, useState, useCallback, useMemo } from "react";
import client from "@/lib/apolloClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { 
  FaBookOpen, 
  FaSearch,
  FaClock,
  FaFire,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import { NotebookCard } from "@/components/notebook/NotebookCard";

interface RootPage {
  createdAt: string;
  hasChildren: boolean;
  id: string;
  index: number;
  path: string;
  slug: string;
  title: string;
  updatedAt: string;
}

interface User {
  email: string;
  username: string;
  profilePicture?: string;
  lastName: string;
}

interface Notebook {
  cover?: string;
  createdAt: string;
  hasPages: boolean;
  id: string;
  name: string;
  overview?: string;
  pagesCount?: number;
  slug: string;
  rootPages: RootPage[];
  user: User;
}

const NOTEBOOKS_QUERY = gql`
  query GetNotebooks($limit: Int, $query: String, $sortBy: NotebookSortBy, $username: String, $lastId: Int) {
    notebooks(limit: $limit, query: $query, sortBy: $sortBy, username: $username, lastId: $lastId) {
      cover
      createdAt
      hasPages
      id
      name
      overview
      pagesCount
      slug
      rootPages {
        createdAt
        hasChildren
        id
        index
        path
        slug
        title
        updatedAt
      }
      user {
        email
        username
        profilePicture
        lastName
      }
    }
  }
`;

export const NotebooksView = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"LATEST" | "OLDEST" | "NAME">("LATEST");
  const [authorFilter, setAuthorFilter] = useState("");
  const [debouncedAuthorFilter, setDebouncedAuthorFilter] = useState("");
  const [limit, setLimit] = useState(20);
  const [lastId, setLastId] = useState<number | undefined>(undefined);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce author filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAuthorFilter(authorFilter);
    }, 1000); // 500ms delay

    return () => clearTimeout(timer);
  }, [authorFilter]);

  const fetchNotebooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await client.query({
        query: NOTEBOOKS_QUERY,
        variables: {
          limit,
          query: debouncedSearchQuery,
          sortBy,
          username: debouncedAuthorFilter || undefined,
          lastId,
        },
      });
      
      if (lastId) {
        // Append new notebooks when loading more
        setNotebooks(prev => [...prev, ...(data.notebooks || [])]);
      } else {
        // Replace notebooks for new search/filter
        setNotebooks(data.notebooks || []);
      }
    } catch (err) {
      console.error("Error fetching notebooks:", err);
      setError("Failed to load notebooks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination when search or filters change
    setLastId(undefined);
    fetchNotebooks();
  }, [debouncedSearchQuery, sortBy, debouncedAuthorFilter]);

  useEffect(() => {
    // Handle pagination
    if (lastId) {
      fetchNotebooks();
    }
  }, [lastId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotebooks();
  };

  const filteredNotebooks = notebooks.filter(notebook => {
    if (debouncedSearchQuery && !notebook.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) && 
        !notebook.overview?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Notebooks</h1>
        <p className="text-muted-foreground">
          Explore knowledge and ideas shared by the InfoBite community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as "LATEST" | "OLDEST" | "NAME");
                setLastId(undefined); // Reset pagination when sort changes
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LATEST">
                  <div className="flex items-center gap-2">
                    <FaClock className="h-3 w-3 text-blue-500" />
                    <span>Latest</span>
                  </div>
                </SelectItem>
                <SelectItem value="OLDEST">
                  <div className="flex items-center gap-2">
                    <FaClock className="h-3 w-3 text-gray-500" />
                    <span>Oldest</span>
                  </div>
                </SelectItem>
                <SelectItem value="NAME">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="h-3 w-3 text-green-500" />
                    <span>Name</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Author Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Author:</span>
            <Input
              placeholder="Filter by username..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="w-48"
            />
          </div>

          {/* Results count */}
          {!loading && (
            <Badge variant="secondary" className="ml-auto">
              {filteredNotebooks.length} {filteredNotebooks.length === 1 ? "notebook" : "notebooks"}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <FaExclamationTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">
              Something went wrong
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">{error}</p>
            <Button onClick={fetchNotebooks} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredNotebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotebooks.map((notebook, index) => (
            <div
              key={notebook.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ 
                animationDelay: `${Math.min(index, 8) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="">
                <NotebookCard 
                  notebook={{
                    ...notebook,
                    user: {
                      firstName: "", // Add required firstName field
                      username: notebook.user.username,
                      lastName: notebook.user.lastName,
                      isSelf: false, // Add required isSelf field
                      id: notebook.user.username, // Use username as id fallback
                      profilePicture: notebook.user.profilePicture,
                    }
                  }} 
                  index={index} 
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FaBookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No notebooks found
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {debouncedSearchQuery || debouncedAuthorFilter 
                ? "Try adjusting your search criteria or filters to find more notebooks."
                : "No notebooks have been published yet. Be the first to share your knowledge!"
              }
            </p>
            {searchQuery || authorFilter ? (
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearchQuery("");
                  setAuthorFilter("");
                  setDebouncedAuthorFilter("");
                  setLastId(undefined);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/new/notebook">
                  Create First Notebook
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {!loading && filteredNotebooks.length > 0 && filteredNotebooks.length >= limit && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => {
              if (notebooks.length > 0) {
                const lastNotebook = notebooks[notebooks.length - 1];
                setLastId(parseInt(lastNotebook.id));
              }
            }}
            variant="outline"
          >
            Load More Notebooks
          </Button>
        </div>
      )}
    </div>
  );
};