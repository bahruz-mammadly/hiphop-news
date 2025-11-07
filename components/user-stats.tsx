"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface UserStatsProps {
  userId: string
}

export default function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState({ posts: 0, comments: 0, upvotes: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [posts, comments] = await Promise.all([
        supabase.from("posts").select("id, upvote_count", { count: "exact" }).eq("author_id", userId),
        supabase.from("comments").select("id", { count: "exact" }).eq("author_id", userId),
      ])

      const totalUpvotes = (posts.data || []).reduce((sum, post) => sum + post.upvote_count, 0)

      setStats({
        posts: posts.count || 0,
        comments: comments.count || 0,
        upvotes: totalUpvotes,
      })
    }

    fetchStats()
  }, [userId])

  return (
    <>
      <Card className="p-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.posts}</div>
          <div className="text-sm text-muted-foreground">Posts Created</div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.comments}</div>
          <div className="text-sm text-muted-foreground">Comments</div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.upvotes}</div>
          <div className="text-sm text-muted-foreground">Total Upvotes</div>
        </div>
      </Card>
    </>
  )
}
