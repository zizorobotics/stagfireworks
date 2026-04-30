-- 1. Create the community_posts table for the Community/Forum page
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access on community_posts" 
    ON public.community_posts FOR SELECT 
    USING (true);

-- Allow anonymous insert access (since this is an open forum without auth)
CREATE POLICY "Allow public insert access on community_posts" 
    ON public.community_posts FOR INSERT 
    WITH CHECK (true);

-- Allow anonymous update access (for liking posts)
CREATE POLICY "Allow public update access on community_posts" 
    ON public.community_posts FOR UPDATE 
    USING (true);


-- 2. Create the testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    review_text TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access on testimonials" 
    ON public.testimonials FOR SELECT 
    USING (is_published = true);

-- Allow anonymous insert access (for customers leaving reviews)
CREATE POLICY "Allow public insert access on testimonials" 
    ON public.testimonials FOR INSERT 
    WITH CHECK (true);

-- Insert some default glowing testimonials!
INSERT INTO public.testimonials (customer_name, rating, review_text) VALUES
('Mark D.', 5, 'Absolutely incredible fireworks. The Vivid range blew my mind. Much better than the supermarket rubbish I used to buy!'),
('Sarah J.', 5, 'Fast delivery, really helpful staff. I asked for low-noise fireworks for my dogs and they pointed me to exactly what I needed. Everything worked perfectly.'),
('James T.', 5, 'The Big Boss compound was the highlight of our Bonfire Night. Unbelievable hang time and colors. Will be ordering again for New Years!'),
('Liam W.', 5, 'Best fireworks in South Yorkshire by far. Stag Fireworks never disappoints, their prices are unbeatable for the quality you get.');
