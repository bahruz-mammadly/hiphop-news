import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/supabase/admin"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AdminNav from "@/components/admin-nav"

export default async function AdminDashboard() {
  const supabase = await getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

        <AdminNav />

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="mt-2 text-3xl font-bold">--</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Flagged Posts</div>
            <div className="mt-2 text-3xl font-bold">--</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Flagged Comments</div>
            <div className="mt-2 text-3xl font-bold">--</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Banned Users</div>
            <div className="mt-2 text-3xl font-bold">--</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/flagged">
              <Button>Review Flagged Content</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">Manage Users</Button>
            </Link>
            <Link href="/admin/logs">
              <Button variant="outline">Moderation Logs</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
