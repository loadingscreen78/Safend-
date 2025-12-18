-- =========================================================
-- 1) Enum for roles (safe creation)
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM (
      'admin',
      'sales',
      'operations',
      'accounts',
      'hr',
      'reports'
    );
  END IF;
END
$$;

-- =========================================================
-- 2) user_roles table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- =========================================================
-- 3) Enable RLS
-- =========================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 4) Security definer helper to check roles
-- =========================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- =========================================================
-- 5) Function to get roles for user
-- =========================================================
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid DEFAULT auth.uid())
RETURNS SETOF public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = COALESCE(_user_id, auth.uid());
$$;

REVOKE ALL ON FUNCTION public.get_user_roles(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;

-- =========================================================
-- 6) Admin-only functions to assign/remove roles
-- =========================================================
CREATE OR REPLACE FUNCTION public.assign_role(
  _user_id uuid,
  _email text,
  _role public.app_role
) RETURNS public.user_roles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _is_admin boolean;
  _row public.user_roles;
BEGIN
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
  INTO _is_admin;

  IF NOT COALESCE(_is_admin, false) THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;

  INSERT INTO public.user_roles(user_id, email, role)
  VALUES (_user_id, _email, _role)
  ON CONFLICT (user_id, role) DO UPDATE
    SET email = EXCLUDED.email
  RETURNING * INTO _row;

  RETURN _row;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_role(uuid, text, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_role(uuid, text, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_role(
  _user_id uuid,
  _role public.app_role
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _is_admin boolean;
  _deleted int;
BEGIN
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
  INTO _is_admin;

  IF NOT COALESCE(_is_admin, false) THEN
    RAISE EXCEPTION 'Only admins can remove roles';
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = _user_id AND role = _role;

  GET DIAGNOSTICS _deleted = ROW_COUNT;
  RETURN _deleted > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.remove_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remove_role(uuid, public.app_role) TO authenticated;

-- =========================================================
-- 7) RLS policies for user_roles (safe recreation)
-- =========================================================
DO $$
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles' AND tablename = 'user_roles') THEN
    DROP POLICY "Users can view their own roles" ON public.user_roles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all user roles' AND tablename = 'user_roles') THEN
    DROP POLICY "Admins can view all user roles" ON public.user_roles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert roles' AND tablename = 'user_roles') THEN
    DROP POLICY "Admins can insert roles" ON public.user_roles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update roles' AND tablename = 'user_roles') THEN
    DROP POLICY "Admins can update roles" ON public.user_roles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete roles' AND tablename = 'user_roles') THEN
    DROP POLICY "Admins can delete roles" ON public.user_roles;
  END IF;
END
$$;

-- Recreate policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
