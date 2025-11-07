import { getPostById } from "@/lib/supabase/community"
import Header from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PostDetail from "@/components/post-detail"
import CommentThread from "@/components/comment-thread"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Post not found</h1>
          <Link href="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/community">
          <Button variant="outline" className="mb-6 bg-transparent">
            ← Back
          </Button>
        </Link>

        <PostDetail post={post} />

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Discussion</h2>
          <CommentThread postId={id} />
        </div>
      </div>
    </div>
  )
}
