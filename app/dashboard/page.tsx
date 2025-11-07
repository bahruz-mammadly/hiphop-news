import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import UserStats from "@/components/user-stats"
import UserActivity from "@/components/user-activity"

export default async function DashboardPage() {
  const supabase = await getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.display_name}</p>
          </div>
          <Link href={`/profile/${user.id}`}>
            <Button variant="outline">View Profile</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <UserStats userId={user.id} />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/community/new" className="block">
                  <Button className="w-full justify-start">Create Post</Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/community" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Browse Community
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Profile Card */}
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-primary/50" />
              <div className="relative px-6 pb-6">
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/50" />
                  <h3 className="text-lg font-semibold">{profile.display_name}</h3>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
                </div>
              </div>
            </Card>
          </div>

          {/* Activity */}
          <div className="lg:col-span-2">
            <UserActivity userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
