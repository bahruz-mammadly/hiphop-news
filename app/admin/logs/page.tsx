import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/server"
import { isAdmin, getModerationLogs } from "@/lib/supabase/admin"
import Header from "@/components/header"
import AdminNav from "@/components/admin-nav"
import ModerationLogsList from "@/components/moderation-logs-list"

export default async function LogsPage() {
  const supabase = await getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    redirect("/")
  }

  const logs = await getModerationLogs(100)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Moderation Logs</h1>

        <AdminNav />

        <div className="mt-8">
          <ModerationLogsList logs={logs} />
        </div>
      </div>
    </div>
  )
}
