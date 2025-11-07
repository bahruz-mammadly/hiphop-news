import { getSupabaseClient } from "./server"
import { createClient } from "./client"

export async function isAdmin(userId: string) {
  const supabase = await getSupabaseClient()

  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single()

  return data?.role === "admin" || data?.role === "moderator"
}

export async function getFlaggedContent(type: "posts" | "comments") {
  const supabase = await getSupabaseClient()

  if (type === "posts") {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles(id, username, display_name),
        moderation_logs(action, reason, created_at)
      `)
      .eq("is_flagged", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles(id, username, display_name),
      moderation_logs(action, reason, created_at)
    `)
    .eq("is_flagged", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function flagContent(type: "post" | "comment", contentId: string, reason: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  if (type === "post") {
    const { error } = await supabase.from("posts").update({ is_flagged: true, flag_reason: reason }).eq("id", contentId)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from("comments")
      .update({ is_flagged: true, flag_reason: reason })
      .eq("id", contentId)

    if (error) throw error
  }
}

export async function deleteContent(type: "post" | "comment" | "user", contentId: string, reason: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Log the action
  await supabase.from("moderation_logs").insert({
    moderator_id: user.id,
    target_type: type,
    target_id: contentId,
    action: "delete",
    reason,
  })

  if (type === "post") {
    const { error } = await supabase.from("posts").delete().eq("id", contentId)
    if (error) throw error
  } else if (type === "comment") {
    const { error } = await supabase.from("comments").delete().eq("id", contentId)
    if (error) throw error
  }
}

export async function banUser(userId: string, reason: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("profiles").update({ is_banned: true }).eq("id", userId)

  if (error) throw error

  await supabase.from("moderation_logs").insert({
    moderator_id: user.id,
    target_type: "user",
    target_id: userId,
    action: "ban",
    reason,
  })
}

export async function unbanUser(userId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("profiles").update({ is_banned: false }).eq("id", userId)

  if (error) throw error

  await supabase.from("moderation_logs").insert({
    moderator_id: user.id,
    target_type: "user",
    target_id: userId,
    action: "approve",
    reason: "User unbanned",
  })
}

export async function getModerationLogs(limit = 50) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from("moderation_logs")
    .select(`
      *,
      moderator:profiles(id, username, display_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getUsers() {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}
