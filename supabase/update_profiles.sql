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
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR
SELECT USING (is_admin());
-- Admins can update profiles (to approve/reject)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles FOR
UPDATE USING (is_admin());
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
-- Seed existing users into profiles if they don't exist
INSERT INTO public.profiles (id, email, role, status)
SELECT id,
    email,
    'user',
    'approved' -- Assume existing users are approved to avoid locking them out
FROM auth.users ON CONFLICT (id) DO NOTHING;