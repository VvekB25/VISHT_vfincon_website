-- Run this migration in the Supabase SQL editor for an existing project.
-- Provision authorized profiles through a trusted operator process only.
BEGIN;

-- Remove only the exact sample records shipped by the old seed script.
DELETE FROM public.comments
WHERE id IN (
  'c1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000004'
) OR post_id IN (
  SELECT id FROM public.blog_posts WHERE slug IN (
    'msme-45-day-payment-rule-section-43b-h',
    'choosing-pvt-ltd-llp-opc-for-startups',
    'statutory-audit-vs-internal-audit-differences'
  )
);

DELETE FROM public.notifications
WHERE id IN (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000004'
) OR slug IN (
  'mandatory-2fa-eway-bill-einvoice',
  'mca-advisory-filing-form-dir-3-kyc-fy26',
  'cbdt-circular-updated-returns-itr-u-timelines',
  'sop-annual-msme-form-1-disclosures-roc'
);

DELETE FROM public.blog_posts
WHERE id IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003'
) OR slug IN (
  'msme-45-day-payment-rule-section-43b-h',
  'choosing-pvt-ltd-llp-opc-for-startups',
  'statutory-audit-vs-internal-audit-differences'
);

ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN full_name DROP DEFAULT;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'editor')
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_read" ON public.profiles;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view published notifications" ON public.notifications;
CREATE POLICY "Public can view published notifications" ON public.notifications FOR SELECT
USING (status = 'published' AND published_at <= now() AND (expires_at IS NULL OR expires_at > now()));
DROP POLICY IF EXISTS "Admins have full access to notifications" ON public.notifications;
CREATE POLICY "Admins have full access to notifications" ON public.notifications FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT
USING (status = 'published' AND published_at <= now());
DROP POLICY IF EXISTS "Admins have full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admins have full access to blog posts" ON public.blog_posts FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
CREATE POLICY "Public can view approved comments" ON public.comments FOR SELECT
USING (status = 'approved');
DROP POLICY IF EXISTS "Public can submit pending comments" ON public.comments;
CREATE POLICY "Public can submit pending comments" ON public.comments FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending' AND char_length(trim(author_name)) BETWEEN 2 AND 60
  AND char_length(trim(content)) BETWEEN 3 AND 1500);
DROP POLICY IF EXISTS "Admins have full access to comments" ON public.comments;
CREATE POLICY "Admins have full access to comments" ON public.comments FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view likes" ON public.post_likes;
DROP POLICY IF EXISTS "Public can add like" ON public.post_likes;
DROP POLICY IF EXISTS "Public can remove own like" ON public.post_likes;
DROP POLICY IF EXISTS "Admins can manage likes" ON public.post_likes;
CREATE POLICY "Admins can manage likes" ON public.post_likes FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

REVOKE ALL ON public.post_likes FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO authenticated;
GRANT SELECT ON public.notifications, public.blog_posts TO anon, authenticated;
GRANT SELECT, INSERT ON public.comments TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notifications, public.blog_posts TO authenticated;
GRANT UPDATE, DELETE ON public.comments TO authenticated;

COMMIT;
