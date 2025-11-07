import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface Article {
  id: string
  title: string
  excerpt: string
  featured_image_url: string | null
  slug: string
  category: string
  author: {
    display_name: string
    username: string
  }
  published_at: string
}

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {articles.map((article) => (
        <Link key={article.id} href={`/news/${article.slug}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg">
            {/* Image */}
            {article.featured_image_url && (
              <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-block rounded-md bg-primary px-2 py-1 text-xs font-semibold uppercase text-primary-foreground">
                    {article.category}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary">
                {article.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.author.display_name}</span>
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
