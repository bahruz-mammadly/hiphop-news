"use client"

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

export default function PostDetail({ post }: { post: Post }) {
  const netVotes = post.upvote_count - post.downvote_count

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2">
          <VoteButtons postId={post.id} initialVotes={netVotes} isDetail />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{post.title}</h1>

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-3 border-b pb-4 text-sm text-muted-foreground">
            <span>
              Posted by <strong>{post.author.display_name}</strong> ({post.author.username})
            </span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comment_count} comments
            </span>
          </div>

          {/* Post Content */}
          <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed">{post.content}</div>
        </div>
      </div>
    </Card>
  )
}
