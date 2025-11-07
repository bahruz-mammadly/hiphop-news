import { getSupabaseClient } from "./server"

export async function getFeaturedArticles() {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      author:profiles(username, display_name, avatar_url)
    `)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(3)

  if (error) throw error
  return data || []
}

export async function getRecentArticles(limit = 12) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      author:profiles(username, display_name, avatar_url)
    `)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getArticlesByCategory(category: string, limit = 6) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      author:profiles(username, display_name, avatar_url)
    `)
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getTrendingPosts(limit = 5) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(username, display_name, avatar_url)
    `)
    .order("upvote_count", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
