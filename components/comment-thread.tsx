"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import CommentCard from "./comment-card"

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

export default function CommentThread({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const fetchComments = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("comments")
        .select(`
          *,
          author:profiles(id, username, display_name, avatar_url)
        `)
        .eq("post_id", postId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: true })

      if (data) setComments(data)
    }

    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          content: newComment,
          author_id: user.id,
        })
        .select(`
          *,
          author:profiles(id, username, display_name, avatar_url)
        `)
        .single()

      if (err) throw err

      if (data) {
        setComments([...comments, data])
        setNewComment("")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isLoading || !newComment.trim()}>
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">Sign in to join the discussion</p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to respond!</p>
        ) : (
          comments.map((comment) => <CommentCard key={comment.id} comment={comment} postId={postId} />)
        )}
      </div>
    </div>
  )
}
