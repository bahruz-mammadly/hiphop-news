"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import VoteButtons from "./vote-buttons"
import { MessageCircle } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  upvote_count: number
  downvote_count: number
  comment_count: number
  created_at: string
  author: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export default function PostCard({ post }: { post: Post }) {
  const netVotes = post.upvote_count - post.downvote_count

  return (
    <Link href={`/community/post/${post.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-md">
        <div className="flex gap-4 p-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-2">
            <VoteButtons postId={post.id} initialVotes={netVotes} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Posted by {post.author.display_name} in {new Date(post.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.comment_count}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
