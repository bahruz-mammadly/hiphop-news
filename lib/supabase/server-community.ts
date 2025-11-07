import { getSupabaseClient } from "./server"

export async function getPosts(limit = 20, offset = 0) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(id, username, display_name, avatar_url),
      post_votes(vote_type)
    `)
    .eq("is_flagged", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data || []
}

export async function getPostById(postId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(id, username, display_name, avatar_url),
      post_votes(vote_type, user_id),
      comments(
        *,
        author:profiles(id, username, display_name, avatar_url),
        comment_votes(vote_type, user_id)
      )
    `)
    .eq("id", postId)
    .single()

  if (error) throw error
  return data
}

export async function getCommentsByPostId(postId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles(id, username, display_name, avatar_url),
      comment_votes(vote_type, user_id)
    `)
    .eq("post_id", postId)
    .is("parent_comment_id", null)
    .order("upvote_count", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getReplies(parentCommentId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles(id, username, display_name, avatar_url),
      comment_votes(vote_type, user_id)
    `)
    .eq("parent_comment_id", parentCommentId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}
