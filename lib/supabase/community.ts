import { createClient } from "./client"

export async function getPosts(limit = 20, offset = 0) {
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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

export async function createPost(title: string, content: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function voteOnPost(postId: string, voteType: "upvote" | "downvote") {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { data: existingVote } = await supabase
    .from("post_votes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existingVote) {
    const { error } = await supabase.from("post_votes").delete().eq("id", existingVote.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("post_votes").insert({
      post_id: postId,
      user_id: user.id,
      vote_type: voteType,
    })
    if (error) throw error
  }
}

export async function createComment(postId: string, content: string, parentCommentId?: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      content,
      author_id: user.id,
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function voteOnComment(commentId: string, voteType: "upvote" | "downvote") {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { data: existingVote } = await supabase
    .from("comment_votes")
    .select()
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .single()

  if (existingVote) {
    const { error } = await supabase.from("comment_votes").delete().eq("id", existingVote.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("comment_votes").insert({
      comment_id: commentId,
      user_id: user.id,
      vote_type: voteType,
    })
    if (error) throw error
  }
}
