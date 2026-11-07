-- ==============================================================================
-- BAROPHOLIO — SUPABASE PRODUCTION ROW LEVEL SECURITY (RLS) POLICIES
-- Date: 2026-11-04
-- Target Table: public.projects
-- Target Bucket: storage.objects (bucket_id = 'project-media')
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ POLICY: Anonymous visitors can ONLY read published projects
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
ON public.projects
FOR SELECT
TO public
USING (published = true);

-- 3. AUTHENTICATED WRITE POLICY: Only signed-in admin accounts can insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Authenticated users can manage projects"
ON public.projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. STORAGE POLICIES FOR 'project-media' BUCKET
-- Allow public read access to all media objects in project-media
DROP POLICY IF EXISTS "Public Read project-media" ON storage.objects;
CREATE POLICY "Public Read project-media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-media');

-- Allow only authenticated users to upload, update, or remove objects in project-media
DROP POLICY IF EXISTS "Authenticated Manage project-media" ON storage.objects;
CREATE POLICY "Authenticated Manage project-media"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'project-media')
WITH CHECK (bucket_id = 'project-media');

