import { getUserProfile, getUserPosts } from "@/lib/supabase/profiles"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/server"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await getUserProfile(id)
  const posts = await getUserPosts(id)

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
        </div>
      </div>
    )
  }

  const supabase = await getSupabaseClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  const isOwnProfile = currentUser?.id === id

  // Calculate stats
  const totalUpvotes = posts.reduce((sum, post) => sum + post.upvote_count, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comment_count, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
          <div className="relative px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="relative -mt-16 h-32 w-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/50" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{profile.display_name}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
                {profile.bio && <p className="mt-3 text-base">{profile.bio}</p>}
                {isOwnProfile && (
                  <Link href="/profile/edit" className="mt-4 inline-block">
                    <Button>Edit Profile</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalUpvotes}</div>
                <div className="text-sm text-muted-foreground">Upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalComments}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </div>
        </Card>

        {/* User Posts */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Recent Posts</h2>
          {posts.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <p>No posts yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/community/post/${post.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-md">
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        <span>{post.upvote_count} upvotes</span>
                        <span>{post.comment_count} comments</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
