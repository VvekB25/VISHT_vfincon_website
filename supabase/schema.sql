-- ==============================================================================
-- VFINCON Database Schema Migration
-- Compatible with Supabase PostgreSQL (including Row Level Security)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES (Admin Users)
-- Links to Supabase auth.users to store administrative role
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN full_name DROP DEFAULT;

-- 3. NOTIFICATIONS TABLE
-- Regulatory, tax, MCA, accounting and statutory updates
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('GST', 'Income Tax', 'MCA/ROC', 'Accounting', 'Compliance', 'General')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  attachment_url TEXT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. BLOG POSTS TABLE
-- Articles on corporate compliance, tax strategies, audit and finance
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL DEFAULT 'Vidmahi Fin Consultants Advisory Desk',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. COMMENTS TABLE (Moderated)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL CHECK (char_length(trim(author_name)) >= 2 AND char_length(author_name) <= 60),
  content TEXT NOT NULL CHECK (char_length(trim(content)) >= 3 AND char_length(content) <= 1500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. POST LIKES TABLE (Unique per visitor token)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_post_visitor_like UNIQUE (post_id, visitor_id)
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_notifications_slug ON public.notifications(slug);
CREATE INDEX IF NOT EXISTS idx_notifications_status_pub ON public.notifications(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_pub ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

CREATE INDEX IF NOT EXISTS idx_comments_post_status ON public.comments(post_id, status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_visitor ON public.post_likes(post_id, visitor_id);

-- 8. TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_notifications_updated_at ON public.notifications;
CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. HELPER SECURITY FUNCTION: IS_ADMIN()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'editor')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 10. ROW LEVEL SECURITY (RLS) SETUP
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_read" ON public.profiles;
CREATE POLICY "profiles_self_read"
ON public.profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;

-- Notifications Policies
-- Public: Read only published & non-expired notifications
DROP POLICY IF EXISTS "Public can view published notifications" ON public.notifications;
CREATE POLICY "Public can view published notifications"
ON public.notifications FOR SELECT
USING (
  status = 'published'
  AND published_at <= timezone('utc'::text, now())
  AND (expires_at IS NULL OR expires_at > timezone('utc'::text, now()))
);

-- Admin: Full access on notifications
DROP POLICY IF EXISTS "Admins have full access to notifications" ON public.notifications;
CREATE POLICY "Admins have full access to notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Blog Posts Policies
-- Public: Read only published posts
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
USING (
  status = 'published'
  AND published_at <= timezone('utc'::text, now())
);

-- Admin: Full access on blog posts
DROP POLICY IF EXISTS "Admins have full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admins have full access to blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Comments Policies
-- Public: Read only approved comments
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
CREATE POLICY "Public can view approved comments"
ON public.comments FOR SELECT
USING (status = 'approved');

-- Public: Insert comments strictly as 'pending'
DROP POLICY IF EXISTS "Public can submit pending comments" ON public.comments;
CREATE POLICY "Public can submit pending comments"
ON public.comments FOR INSERT
WITH CHECK (
  status = 'pending'
  AND char_length(trim(author_name)) >= 2
  AND char_length(trim(author_name)) <= 60
  AND char_length(trim(content)) BETWEEN 3 AND 1500
);

-- Admin: Full access to moderate (update, delete, view all) comments
DROP POLICY IF EXISTS "Admins have full access to comments" ON public.comments;
CREATE POLICY "Admins have full access to comments"
ON public.comments FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Anonymous like writes are disabled because browser-generated visitor IDs do
-- not prove ownership and can be forged. Keep the table accessible to admins only.
DROP POLICY IF EXISTS "Public can remove own like" ON public.post_likes;
DROP POLICY IF EXISTS "Public can add like" ON public.post_likes;
DROP POLICY IF EXISTS "Public can view likes" ON public.post_likes;
DROP POLICY IF EXISTS "Admins can manage likes" ON public.post_likes;
CREATE POLICY "Admins can manage likes"
ON public.post_likes FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
REVOKE ALL ON public.post_likes FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO authenticated;

-- Explicit least-privilege table grants. RLS policies above remain the
-- authorization boundary for every row-level operation.
GRANT SELECT ON public.notifications, public.blog_posts TO anon, authenticated;
GRANT SELECT, INSERT ON public.comments TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notifications, public.blog_posts TO authenticated;
GRANT UPDATE, DELETE ON public.comments TO authenticated;

-- 11. STORAGE BUCKET FOR CONTENT ATTACHMENTS (OPTIONAL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-assets', 'content-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view content assets" ON storage.objects;
CREATE POLICY "Public can view content assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-assets');

DROP POLICY IF EXISTS "Admins can upload content assets" ON storage.objects;
CREATE POLICY "Admins can upload content assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete content assets" ON storage.objects;
CREATE POLICY "Admins can delete content assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-assets' AND public.is_admin());

