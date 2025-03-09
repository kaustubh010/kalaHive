-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create artwork_views table to track views
CREATE TABLE IF NOT EXISTS artwork_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- Create artwork_likes table to track likes
CREATE TABLE IF NOT EXISTS artwork_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for artworks
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Anyone can view artworks
CREATE POLICY "Anyone can view artworks" 
  ON artworks FOR SELECT 
  USING (true);

-- Artists can insert their own artworks
CREATE POLICY "Artists can insert their own artworks" 
  ON artworks FOR INSERT 
  WITH CHECK (auth.uid() = artist_id);

-- Artists can update their own artworks
CREATE POLICY "Artists can update their own artworks" 
  ON artworks FOR UPDATE 
  USING (auth.uid() = artist_id);

-- Artists can delete their own artworks
CREATE POLICY "Artists can delete their own artworks" 
  ON artworks FOR DELETE 
  USING (auth.uid() = artist_id);

-- Create RLS policies for artwork_views
ALTER TABLE artwork_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views
CREATE POLICY "Anyone can insert views" 
  ON artwork_views FOR INSERT 
  WITH CHECK (true);

-- Create RLS policies for artwork_likes
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;

-- Authenticated users can like artworks
CREATE POLICY "Authenticated users can like artworks" 
  ON artwork_likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" 
  ON artwork_likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE artworks
  SET view_count = view_count + 1
  WHERE id = NEW.artwork_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment view count
CREATE TRIGGER increment_artwork_view_count
AFTER INSERT ON artwork_views
FOR EACH ROW
EXECUTE FUNCTION increment_view_count();

-- Create function to update like count
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE artworks
    SET like_count = like_count + 1
    WHERE id = NEW.artwork_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE artworks
    SET like_count = like_count - 1
    WHERE id = OLD.artwork_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update like count
CREATE TRIGGER increment_artwork_like_count
AFTER INSERT ON artwork_likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

CREATE TRIGGER decrement_artwork_like_count
AFTER DELETE ON artwork_likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

-- Create storage bucket for artwork
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to artwork files
CREATE POLICY "Artwork files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'artworks');

-- Allow authenticated users to upload artwork files
CREATE POLICY "Users can upload artwork files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artworks' AND auth.uid() IS NOT NULL);

-- Allow users to update their own artwork files
CREATE POLICY "Users can update their own artwork files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'artworks' AND auth.uid() = owner);

-- Allow users to delete their own artwork files
CREATE POLICY "Users can delete their own artwork files"
ON storage.objects FOR DELETE
USING (bucket_id = 'artworks' AND auth.uid() = owner); 