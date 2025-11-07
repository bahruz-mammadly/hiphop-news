"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  featured_image_url: string | null
  slug: string
  category: string
}

export default function FeaturedCarousel({
  articles,
}: {
  articles: Article[]
}) {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoPlay, articles.length])

  const next = () => {
    setCurrent((prev) => (prev + 1) % articles.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + articles.length) % articles.length)
    setAutoPlay(false)
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-secondary"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {articles.map((article, idx) => (
          <Link key={article.id} href={`/news/${article.slug}`}>
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === current ? "opacity-100" : "opacity-0"
              }`}
            >
              {article.featured_image_url && (
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority={idx === current}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2 inline-block rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase">
                  {article.category}
                </div>
                <h2 className="text-2xl font-bold leading-tight md:text-3xl">{article.title}</h2>
                <p className="mt-2 text-sm text-gray-200 line-clamp-2">{article.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 transition-opacity hover:bg-white/30 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 transition-opacity hover:bg-white/30 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoPlay(false)
            }}
            className={`h-2 rounded-full transition-all ${
              idx === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
