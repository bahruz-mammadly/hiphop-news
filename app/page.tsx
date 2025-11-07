import { getFeaturedArticles, getRecentArticles, getTrendingPosts } from "@/lib/supabase/queries"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import FeaturedCarousel from "@/components/featured-carousel"
import ArticleGrid from "@/components/article-grid"
import TrendingSection from "@/components/trending-section"

export default async function HomePage() {
  const [featuredArticles, recentArticles, trendingPosts] = await Promise.all([
    getFeaturedArticles(),
    getRecentArticles(12),
    getTrendingPosts(5),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero/Featured Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background px-4 py-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Hip-Hop News Hub</h1>
            <p className="text-lg text-muted-foreground">
              Breaking news, interviews, and culture from the world of hip-hop
            </p>
          </div>

          {/* Featured Carousel */}
          {featuredArticles.length > 0 && <FeaturedCarousel articles={featuredArticles} />}
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Articles Grid */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest News</h2>
              <Link href="/news">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <ArticleGrid articles={recentArticles} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Posts */}
            <TrendingSection posts={trendingPosts} />

            {/* Community CTA */}
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <h3 className="mb-3 text-lg font-semibold">Join the Community</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Share your takes, engage with fans, and stay connected to hip-hop culture.
              </p>
              <Link href="/community" className="w-full">
                <Button className="w-full">Explore Community</Button>
              </Link>
            </Card>

            {/* Categories */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <div className="space-y-2">
                {["news", "interviews", "reviews", "culture", "trends"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat}`}
                    className="block rounded-md px-3 py-2 text-sm font-medium capitalize hover:bg-secondary"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
