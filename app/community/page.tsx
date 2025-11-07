import { getPosts } from "@/lib/supabase/community"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CommunityFeed from "@/components/community-feed"

export default async function CommunityPage() {
  const posts = await getPosts(20)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">Share your thoughts, discuss hip-hop, and engage with fellow fans</p>
          </div>
          <Link href="/community/new">
            <Button>Create Post</Button>
          </Link>
        </div>

        {/* Feed */}
        <CommunityFeed initialPosts={posts} />
      </div>
    </div>
  )
}
