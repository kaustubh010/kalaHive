"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/main-layout";
import { ArtworkCard } from "@/components/artwork-card";
import { getArtworks } from "@/utils/artwork";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { ArtworkWithArtist } from "@/utils/artwork";

const CATEGORIES = [
  "All",
  "Painting",
  "Digital Art",
  "Photography",
  "Sculpture",
  "Drawing",
  "Mixed Media",
  "Illustration",
  "Graphic Design",
  "Other",
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Newest" },
  { value: "created_at:asc", label: "Oldest" },
  { value: "view_count:desc", label: "Most Viewed" },
  { value: "like_count:desc", label: "Most Liked" },
];

export default function ExplorePage() {
  const [artworks, setArtworks] = useState<ArtworkWithArtist[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("created_at:desc");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch artworks with current filters
  const fetchArtworks = async () => {
    setError(null);

    try {
      const [sortBy, sortOrder] = sortOption.split(":");
      
      const { artworks: fetchedArtworks, count, error } = await getArtworks({
        limit,
        page,
        category: category === "All" ? null : category,
        sortBy: sortBy as "created_at" | "view_count" | "like_count",
        sortOrder: sortOrder as "asc" | "desc",
        search: searchQuery || null,
      });

      if (error) {
        console.error("Error fetching artworks:", error);
        throw new Error(error.message || "Failed to fetch artworks");
      }

      setArtworks(fetchedArtworks);
      setTotalCount(count);
    } catch (err: any) {
      console.error("Error fetching artworks:", err);
      setError(err.message || "Failed to load artworks. Please try again later.");
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchArtworks();
  }, [page, category, sortOption]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchArtworks();
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={page === 1}
            onClick={() => setPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if not on first few pages
      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => setPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if not on last few pages
      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Render skeleton UI for artworks
  const renderSkeletonArtworks = () => {
    return Array.from({ length: limit }).map((_, index) => (
      <div key={index} className="overflow-hidden h-full rounded-lg">
        <div className="aspect-square bg-muted animate-pulse"></div>
        <div className="p-4 space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    ));
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Explore Artworks</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artworks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchArtworks}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!error && artworks.length === 0 && totalCount === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No artworks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategory("All");
              setSortOption("created_at:desc");
              setPage(1);
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.length > 0 ? (
            artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))
          ) : !error && totalCount > 0 ? (
            renderSkeletonArtworks()
          ) : null}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                {page === 1 ? (
                  <Button variant="ghost" size="default" className="gap-1 pl-2.5 opacity-50 cursor-not-allowed" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                ) : (
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                )}
              </PaginationItem>
              
              {getPaginationItems()}
              
              <PaginationItem>
                {page === totalPages ? (
                  <Button variant="ghost" size="default" className="gap-1 pr-2.5 opacity-50 cursor-not-allowed" disabled>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </MainLayout>
  );
} 