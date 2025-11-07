"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { voteOnPost } from "@/lib/supabase/community"

export default function VoteButtons({
  postId,
  initialVotes,
  isDetail = false,
}: {
  postId: string
  initialVotes: number
  isDetail?: boolean
}) {
  const [votes, setVotes] = useState(initialVotes)
  const [isLoading, setIsLoading] = useState(false)

  const handleVote = async (type: "upvote" | "downvote") => {
    setIsLoading(true)
    try {
      await voteOnPost(postId, type)
      setVotes(type === "upvote" ? votes + 1 : votes - 1)
    } catch (err) {
      console.error("Vote failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex ${isDetail ? "flex-row gap-2" : "flex-col items-center gap-1"}`}>
      <Button
        variant="ghost"
        size={isDetail ? "sm" : "icon"}
        onClick={() => handleVote("upvote")}
        disabled={isLoading}
        className={isDetail ? "h-8 w-8" : "h-8 w-8"}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <span className={`text-sm font-semibold ${votes > 0 ? "text-primary" : votes < 0 ? "text-destructive" : ""}`}>
        {votes}
      </span>
      <Button
        variant="ghost"
        size={isDetail ? "sm" : "icon"}
        onClick={() => handleVote("downvote")}
        disabled={isLoading}
        className={isDetail ? "h-8 w-8" : "h-8 w-8"}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
