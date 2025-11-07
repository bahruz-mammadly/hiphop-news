"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteContent } from "@/lib/supabase/admin"
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

interface FlaggedItem {
  id: string
  content?: string
  title?: string
  flag_reason: string
  author: {
    id: string
    username: string
    display_name: string
  }
  created_at: string
}

interface Props {
  items: FlaggedItem[]
  type: "post" | "comment"
}

export default function FlaggedContentList({ items, type }: Props) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (itemId: string) => {
    setIsDeleting(itemId)
    try {
      await deleteContent(type, itemId, "Moderation action")
      // Refresh page
      window.location.reload()
    } catch (err) {
      console.error("Delete failed:", err)
      setIsDeleting(null)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        <p>No flagged {type}s</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{type === "post" ? item.title : "Comment Reply"}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.content}</p>
              </div>
              <div className="flex-shrink-0 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                Flagged
              </div>
            </div>

            <div className="mb-4 text-sm text-muted-foreground">
              <p>
                By: {item.author.display_name} (@{item.author.username})
              </p>
              <p>Reason: {item.flag_reason}</p>
              <p>Posted: {new Date(item.created_at).toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this {type}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The {type} will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogAction onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id}>
                    {isDeleting === item.id ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm">
                Clear Flag
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
