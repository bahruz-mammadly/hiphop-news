import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchResultsProps {
  results: {
    articles?: any[]
    posts?: any[]
    users?: any[]
  }
  query: string
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  return (
    <div className="space-y-8">
      {/* Articles */}
      {results.articles && results.articles.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            Articles
            <Badge variant="secondary">{results.articles.length}</Badge>
          </h2>
          <div className="space-y-3">
            {results.articles.map((article: any) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-md p-4">
                  <h3 className="font-semibold group-hover:text-primary line-clamp-1">{article.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.author.display_name}</span>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {results.posts && results.posts.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            Community Posts
            <Badge variant="secondary">{results.posts.length}</Badge>
          </h2>
          <div className="space-y-3">
            {results.posts.map((post: any) => (
              <Link key={post.id} href={`/community/post/${post.id}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-md p-4">
                  <h3 className="font-semibold group-hover:text-primary line-clamp-1">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author.display_name}</span>
                    <span>
                      {post.upvote_count} upvotes • {post.comment_count} comments
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Users */}
      {results.users && results.users.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            Users
            <Badge variant="secondary">{results.users.length}</Badge>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.users.map((user: any) => (
              <Link key={user.id} href={`/profile/${user.id}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-md p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                    <div className="min-w-0">
                      <h3 className="font-semibold group-hover:text-primary line-clamp-1">{user.display_name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">@{user.username}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
