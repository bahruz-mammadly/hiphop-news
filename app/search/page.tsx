"use client"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import SearchResults from "@/components/search-results"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState<"all" | "articles" | "posts" | "users">("all")

  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      return
    }

    const search = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(search, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, type])

  const totalResults = useMemo(() => {
    if (!results) return 0
    return (results.articles?.length || 0) + (results.posts?.length || 0) + (results.users?.length || 0)
  }, [results])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Search</h1>
          <div className="space-y-4">
            <Input
              type="search"
              placeholder="Search articles, posts, or users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-base"
            />

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(["all", "articles", "posts", "users"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    type === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {query.length < 2 ? (
          <div className="text-center text-muted-foreground">
            <p>Enter at least 2 characters to search</p>
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground">
            <p>Searching...</p>
          </div>
        ) : results && totalResults > 0 ? (
          <SearchResults results={results} query={query} />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
