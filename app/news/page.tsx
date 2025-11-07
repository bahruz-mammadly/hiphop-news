import { getRecentArticles } from "@/lib/supabase/queries"
import Header from "@/components/header"
import ArticleGrid from "@/components/article-grid"

export default async function NewsPage() {
  const articles = await getRecentArticles(24)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All News</h1>
          <p className="text-muted-foreground">Latest hip-hop news and culture</p>
        </div>

        <ArticleGrid articles={articles} />
      </div>
    </div>
  )
}
