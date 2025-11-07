import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/server"
import { isAdmin, getUsers } from "@/lib/supabase/admin"
import Header from "@/components/header"
import AdminNav from "@/components/admin-nav"
import UserManagementList from "@/components/user-management-list"

export default async function UsersPage() {
  const supabase = await getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    redirect("/")
  }

  const users = await getUsers()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">User Management</h1>

        <AdminNav />

        <div className="mt-8">
          <UserManagementList users={users} />
        </div>
      </div>
    </div>
  )
}
