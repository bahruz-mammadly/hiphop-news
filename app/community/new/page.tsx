"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/lib/supabase/community"
import Link from "next/link"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createPost(title, content)
      router.push("/community")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/community">
          <Button variant="outline" className="mb-6 bg-transparent">
            ← Back
          </Button>
        </Link>

        <Card className="p-6">
          <h1 className="mb-6 text-2xl font-bold">Create a New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="What's on your mind about hip-hop?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, opinions, or start a discussion..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-48 resize-none"
              />
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading || !title || !content}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
              <Link href="/community">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
