-- Additional performance indexes for search and filtering
CREATE INDEX IF NOT EXISTS idx_articles_title_search ON public.articles USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_content_search ON public.articles USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON public.posts USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON public.posts USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_username_search ON public.profiles USING GIN (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_search ON public.profiles USING GIN (display_name gin_trgm_ops);

-- Real-time indexes
CREATE INDEX IF NOT EXISTS idx_posts_created_recent ON public.posts(created_at DESC) WHERE is_flagged = false;
CREATE INDEX IF NOT EXISTS idx_comments_created_recent ON public.comments(created_at DESC) WHERE is_flagged = false;
