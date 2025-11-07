import { getArticlesByCategory } from "@/lib/supabase/queries"
import Header from "@/components/header"
import ArticleGrid from "@/components/article-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const articles = await getArticlesByCategory(category, 24)

  const categoryNames: Record<string, string> = {
    news: "Breaking News",
    interviews: "Interviews",
    reviews: "Reviews",
    culture: "Culture",
    trends: "Trends",
  }

  const displayName = categoryNames[category] || category

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold capitalize">{displayName}</h1>
            <p className="text-muted-foreground">{articles.length} articles in this category</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <ArticleGrid articles={articles} />

        {articles.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>No articles found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
