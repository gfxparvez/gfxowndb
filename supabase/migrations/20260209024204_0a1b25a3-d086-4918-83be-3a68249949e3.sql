
-- Profiles table for user display names
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Databases table
CREATE TABLE public.databases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.databases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own databases" ON public.databases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own databases" ON public.databases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own databases" ON public.databases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own databases" ON public.databases FOR DELETE USING (auth.uid() = user_id);

-- Database tables
CREATE TABLE public.database_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id UUID REFERENCES public.databases(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.database_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tables" ON public.database_tables FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.databases WHERE id = database_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own tables" ON public.database_tables FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.databases WHERE id = database_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own tables" ON public.database_tables FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.databases WHERE id = database_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own tables" ON public.database_tables FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.databases WHERE id = database_id AND user_id = auth.uid())
);

-- Table columns
CREATE TABLE public.table_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.database_tables(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  data_type TEXT NOT NULL DEFAULT 'text',
  is_nullable BOOLEAN NOT NULL DEFAULT true,
  default_value TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.table_columns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own columns" ON public.table_columns FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create own columns" ON public.table_columns FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own columns" ON public.table_columns FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete own columns" ON public.table_columns FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);

-- Table rows (JSONB data storage)
CREATE TABLE public.table_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES public.database_tables(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.table_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rows" ON public.table_rows FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create own rows" ON public.table_rows FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own rows" ON public.table_rows FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete own rows" ON public.table_rows FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.database_tables dt
    JOIN public.databases d ON d.id = dt.database_id
    WHERE dt.id = table_id AND d.user_id = auth.uid()
  )
);

-- API keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id UUID REFERENCES public.databases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key_value TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  name TEXT NOT NULL DEFAULT 'Default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own api_keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own api_keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api_keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api_keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- Query logs
CREATE TABLE public.query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id UUID REFERENCES public.databases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 200,
  request_body JSONB,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.query_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON public.query_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own logs" ON public.query_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_databases_updated_at BEFORE UPDATE ON public.databases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_database_tables_updated_at BEFORE UPDATE ON public.database_tables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_table_rows_updated_at BEFORE UPDATE ON public.table_rows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Also allow service role to insert query logs (for edge functions)
CREATE POLICY "Service can insert logs" ON public.query_logs FOR INSERT WITH CHECK (true);
