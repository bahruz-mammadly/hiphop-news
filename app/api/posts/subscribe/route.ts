import { getSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Simple polling-based "real-time" for new posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lastUpdated = searchParams.get("lastUpdated")

    const supabase = await getSupabaseClient()

    let query = supabase
      .from("posts")
      .select(`
        *,
        author:profiles(id, username, display_name, avatar_url),
        post_votes(vote_type)
      `)
      .eq("is_flagged", false)
      .order("created_at", { ascending: false })
      .limit(5)

    if (lastUpdated) {
      query = query.gt("created_at", lastUpdated)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      posts: data || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
