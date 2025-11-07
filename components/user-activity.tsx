"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { MessageCircle, ThumbsUp } from "lucide-react"

interface UserActivityProps {
  userId: string
}

interface Activity {
  id: string
  title: string
  content: string
  type: "post" | "comment"
  created_at: string
  upvote_count?: number
  comment_count?: number
}

export default function UserActivity({ userId }: UserActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient()

      const [posts, comments] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, content, created_at, upvote_count, comment_count")
          .eq("author_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("comments")
          .select("id, content, created_at")
          .eq("author_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
      ])

      const postActivities: Activity[] = (posts.data || []).map((post) => ({
        ...post,
        type: "post" as const,
        title: post.title,
      }))

      const commentActivities: Activity[] = (comments.data || []).map((comment) => ({
        id: comment.id,
        title: "Replied",
        content: comment.content,
        type: "comment" as const,
        created_at: comment.created_at,
      }))

      const combined = [...postActivities, ...commentActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15)

      setActivities(combined)
      setIsLoading(false)
    }

    fetchActivities()
  }, [userId])

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 border-b pb-4 last:border-0">
              <div className="mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-primary/10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {activity.type === "post" ? (
                      <Link href={`/community/post/${activity.id}`}>
                        <h3 className="font-medium hover:text-primary line-clamp-1">{activity.title}</h3>
                      </Link>
                    ) : (
                      <p className="font-medium">Replied on a post</p>
                    )}
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{activity.content}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {activity.type === "post" ? (
                    <>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {activity.upvote_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {activity.comment_count}
                      </span>
                    </>
                  ) : null}
                  <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
