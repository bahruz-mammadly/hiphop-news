import { getSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all" // articles, posts, users, all

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 })
    }

    const supabase = await getSupabaseClient()
    const results: any = {}

    // Search articles
    if (type === "all" || type === "articles") {
      const { data: articles } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          category,
          featured_image_url,
          author:profiles(display_name, username)
        `)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(10)

      results.articles = articles || []
    }

    // Search community posts
    if (type === "all" || type === "posts") {
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          upvote_count,
          comment_count,
          author:profiles(display_name, username)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .eq("is_flagged", false)
        .limit(10)

      results.posts = posts || []
    }

    // Search users
    if (type === "all" || type === "users") {
      const { data: users } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .eq("is_banned", false)
        .limit(10)

      results.users = users || []
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
