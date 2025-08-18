-- Create enum for link types
CREATE TYPE public.link_type AS ENUM ('profile', 'document', 'chat', 'settings', 'other');

-- Create enum for link status
CREATE TYPE public.link_status AS ENUM ('active', 'disabled', 'expired');

-- Create shareable_links table
CREATE TABLE public.shareable_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link_type public.link_type NOT NULL DEFAULT 'other',
    content JSONB NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'application/json',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.link_status NOT NULL DEFAULT 'active',
    password_hash TEXT,
    max_views INTEGER,
    current_views INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create link_analytics table
CREATE TABLE public.link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES public.shareable_links(id) ON DELETE CASCADE NOT NULL,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create link_permissions table for fine-grained access control
CREATE TABLE public.link_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES public.shareable_links(id) ON DELETE CASCADE NOT NULL,
    permission_type TEXT NOT NULL, -- 'view', 'download', 'edit'
    allowed_domains TEXT[],
    allowed_ips TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shareable_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for shareable_links
CREATE POLICY "Users can view their own links" 
ON public.shareable_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own links" 
ON public.shareable_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" 
ON public.shareable_links 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" 
ON public.shareable_links 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for link_analytics
CREATE POLICY "Users can view analytics for their links" 
ON public.link_analytics 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.shareable_links 
        WHERE shareable_links.id = link_analytics.link_id 
        AND shareable_links.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can insert analytics" 
ON public.link_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create policies for link_permissions
CREATE POLICY "Users can manage permissions for their links" 
ON public.link_permissions 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.shareable_links 
        WHERE shareable_links.id = link_permissions.link_id 
        AND shareable_links.user_id = auth.uid()
    )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shareable_links_updated_at
    BEFORE UPDATE ON public.shareable_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique file_id
CREATE OR REPLACE FUNCTION public.generate_file_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_link_views(link_file_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.shareable_links 
    SET current_views = COALESCE(current_views, 0) + 1 
    WHERE file_id = link_file_id AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX idx_shareable_links_file_id ON public.shareable_links(file_id);
CREATE INDEX idx_shareable_links_user_id ON public.shareable_links(user_id);
CREATE INDEX idx_shareable_links_status ON public.shareable_links(status);
CREATE INDEX idx_link_analytics_link_id ON public.link_analytics(link_id);
CREATE INDEX idx_link_analytics_viewed_at ON public.link_analytics(viewed_at);