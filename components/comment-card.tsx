"use client"

import { Card } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Comment {
  id: string
  content: string
  upvote_count: number
  downvote_count: number
  created_at: string
  author: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export default function CommentCard({ comment }: { comment: Comment }) {
  const netVotes = comment.upvote_count - comment.downvote_count

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/50" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <strong>{comment.author.display_name}</strong>
            <span className="text-muted-foreground">@{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>

          <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>

          {/* Vote Buttons */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              {netVotes > 0 && <span className="text-primary">{netVotes}</span>}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsDown className="h-3 w-3" />
              </Button>
              {netVotes < 0 && <span className="text-destructive">{Math.abs(netVotes)}</span>}
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              Reply
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
