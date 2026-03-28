import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { search } from "@/api/search";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography";
import { ASSETS_URL } from "@/config/env";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function SearchInput() {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const isTyping = query !== debouncedQuery;
  const shouldFetch = debouncedQuery.length >= 3;
  const open = query.length >= 3;

  const { data, isLoading } = useQuery({
    queryKey: ["SEARCH", debouncedQuery],
    queryFn: async () => await search(debouncedQuery),
    enabled: shouldFetch,
    staleTime: 1000 * 60,
  });

  const results = data?.data ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const showSkeleton = open && (isLoading || isTyping);
  const showResults = open && !isLoading && !isTyping && results.length > 0;
  const showEmpty =
    open && !isLoading && !isTyping && shouldFetch && results.length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <Label htmlFor="search_inp" className="cursor-pointer">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary z-10" />
      </Label>
      <Input
        className="pl-9 text-primary border-primary/50! focus:border-primary!"
        value={query}
        ref={inputRef}
        onChange={handleChange}
        id="search_inp"
        placeholder="Search anime..."
        type="search"
        autoComplete="off"
      />
      <X
        onClick={() => setQuery("")}
        className="text-primary absolute right-3 top-1/2 -translate-y-1/2 size-4 cursor-pointer z-10"
      />

      {(showSkeleton || showResults || showEmpty) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border bg-popover shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {showSkeleton && (
              <>
                <Skeleton className="h-8 w-full mb-1" />
                <Skeleton className="h-8 w-full mb-1" />
                <Skeleton className="h-8 w-3/4" />
              </>
            )}

            {showResults &&
              results.map((item) => (
                <div
                  key={item._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery("");
                    navigate("/anime/" + item._id);
                    inputRef.current?.blur();
                  }}
                  className={cn(
                    "px-3 py-2 text-sm rounded-sm cursor-pointer flex flex-row items-center gap-5",
                    "hover:bg-linear-to-l hover:bg-radial from-accent to-primary hover:text-accent-foreground",
                  )}
                >
                  <img
                    src={ASSETS_URL + item.image}
                    className="w-10 h-10 rounded-sm border-2 object-cover"
                  />
                  <TypographyP className="my-auto text-primary font-bold">
                    {item.name.uz}
                  </TypographyP>
                </div>
              ))}

            {showEmpty && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Natija topilmadi
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
