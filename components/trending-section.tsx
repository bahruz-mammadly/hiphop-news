import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowUp } from "lucide-react"

interface Post {
  id: string
  title: string
  upvote_count: number
  comment_count: number
  author: {
    display_name: string
    username: string
  }
}

export default function TrendingSection({ posts }: { posts: Post[] }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <ArrowUp className="h-5 w-5 text-primary" />
        Trending Now
      </h3>
      <div className="space-y-3">
        {posts.map((post, idx) => (
          <Link
            key={post.id}
            href={`/community/post/${post.id}`}
            className="block rounded-md p-3 transition-colors hover:bg-secondary"
          >
            <div className="mb-1 flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {idx + 1}
              </span>
              <h4 className="line-clamp-2 text-sm font-medium leading-tight">{post.title}</h4>
            </div>
            <div className="ml-9 text-xs text-muted-foreground">
              {post.upvote_count} upvotes • {post.comment_count} comments
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
