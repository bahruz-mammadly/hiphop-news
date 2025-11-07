"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { banUser, unbanUser } from "@/lib/supabase/admin"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  username: string
  display_name: string
  role: string
  is_banned: boolean
  created_at: string
}

interface Props {
  users: User[]
}

export default function UserManagementList({ users }: Props) {
  const [isBanning, setIsBanning] = useState<string | null>(null)

  const handleBan = async (userId: string) => {
    setIsBanning(userId)
    try {
      await banUser(userId, "Admin action")
      window.location.reload()
    } catch (err) {
      console.error("Ban failed:", err)
      setIsBanning(null)
    }
  }

  const handleUnban = async (userId: string) => {
    setIsBanning(userId)
    try {
      await unbanUser(userId)
      window.location.reload()
    } catch (err) {
      console.error("Unban failed:", err)
      setIsBanning(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Joined</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{user.display_name}</div>
                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                </td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                      user.is_banned ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"
                    }`}
                  >
                    {user.is_banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={user.is_banned ? "outline" : "destructive"} size="sm">
                        {user.is_banned ? "Unban" : "Ban"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{user.is_banned ? "Unban" : "Ban"} User?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.is_banned
                            ? "This user will be able to access the platform again."
                            : "This user will be banned from the platform."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogAction
                        onClick={() => (user.is_banned ? handleUnban(user.id) : handleBan(user.id))}
                        disabled={isBanning === user.id}
                      >
                        {isBanning === user.id ? "Processing..." : "Confirm"}
                      </AlertDialogAction>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
