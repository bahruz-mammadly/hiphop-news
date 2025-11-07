import { redirect } from "next/navigation"
import { isAdmin, getFlaggedContent } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import AdminNav from "@/components/admin-nav"
import FlaggedContentList from "@/components/flagged-content-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FlaggedContentPage() {
  const supabase = await getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    redirect("/")
  }

  const [flaggedPosts, flaggedComments] = await Promise.all([getFlaggedContent("posts"), getFlaggedContent("comments")])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Flagged Content</h1>

        <AdminNav />

        <Tabs defaultValue="posts" className="mt-8">
          <TabsList>
            <TabsTrigger value="posts">Posts ({flaggedPosts.length})</TabsTrigger>
            <TabsTrigger value="comments">Comments ({flaggedComments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <FlaggedContentList items={flaggedPosts} type="post" />
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <FlaggedContentList items={flaggedComments} type="comment" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
