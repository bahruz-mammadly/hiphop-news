"use client"

import { useState } from "react"
import PostCard from "./post-card"

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

export default function CommunityFeed({ initialPosts }: { initialPosts: Post[] }) {
  const [posts] = useState(initialPosts)

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed py-12 text-center text-muted-foreground">
          <p>No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
