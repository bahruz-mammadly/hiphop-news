import { getSupabaseClient } from "./server"
import { createClient } from "./client"

export async function getUserProfile(userId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function getUserPosts(userId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_votes(vote_type)
    `)
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserProfile() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: {
    display_name?: string
    bio?: string
    avatar_url?: string
    username?: string
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

export async function getUserStats(userId: string) {
  const supabase = await getSupabaseClient()

  const [posts, comments] = await Promise.all([
    supabase.from("posts").select("id").eq("author_id", userId),
    supabase.from("comments").select("id").eq("author_id", userId),
  ])

  const totalUpvotes = await supabase
    .from("post_votes")
    .select("id")
    .eq("vote_type", "upvote")
    .in(
      "post_id",
      (await supabase.from("posts").select("id").eq("author_id", userId)).data?.map((p: any) => p.id) || [],
    )

  return {
    posts: posts.data?.length || 0,
    comments: comments.data?.length || 0,
    upvotes: totalUpvotes.data?.length || 0,
  }
}
