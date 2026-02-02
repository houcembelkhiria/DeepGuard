-- 1. Create the storage schema
create schema if not exists storage;
-- 2. Create the buckets table
create table if not exists storage.buckets (
    id text not null primary key,
    name text not null,
    owner uuid references auth.users,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    public boolean default false,
    avif_autodetection boolean default false,
    file_size_limit bigint,
    allowed_mime_types text []
);
-- 3. Create the objects table (where file metadata lives)
create table if not exists storage.objects (
    id uuid not null default gen_random_uuid() primary key,
    bucket_id text references storage.buckets(id),
    name text,
    owner uuid references auth.users,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_accessed_at timestamptz default now(),
    metadata jsonb,
    path_tokens text [] generated always as (string_to_array(name, '/')) stored
);
-- 4. Create the migrations table (optional but good for tracking)
create table if not exists storage.migrations (
    id integer not null primary key,
    name text not null unique,
    hash text not null,
    executed_at timestamptz default now()
);
-- 5. Create Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('Real', 'Fake', 'real', 'fake')),
    confidence FLOAT NOT NULL,
    probabilities JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
-- 3. Create Policies
-- Allow users to view their own predictions
CREATE POLICY "Users can view their own predictions" ON predictions FOR
SELECT USING (auth.uid() = user_id);
-- Allow users to insert their own predictions
CREATE POLICY "Users can insert their own predictions" ON predictions FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- 4. Create Storage Bucket 'uploads'
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;
-- 5. Storage Policies
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
        bucket_id = 'uploads'
        AND auth.uid() = owner
    );
-- Allow public to view uploads
CREATE POLICY "Public can view uploads" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'uploads');
-- 6. Create Profiles Table (User Roles & Status)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 7. Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- 8. Helper Function for Admin Check
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 9. Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR
SELECT USING (is_admin());
-- Admins can update profiles (to approve/reject)
CREATE POLICY "Admins can update profiles" ON public.profiles FOR
UPDATE USING (is_admin());
-- Grant proper permissions to authenticated role (essential for UPDATE to work)
GRANT SELECT,
    UPDATE ON TABLE public.profiles TO authenticated;
-- 10. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, email, role, status)
VALUES (
        new.id,
        new.email,
        'user',
        'pending'
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Check if trigger exists before creating to avoid errors on repeatable runs
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
) THEN CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END IF;
END $$;