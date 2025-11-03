-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  date_of_joining DATE NOT NULL,
  blood_group TEXT,
  photo_url TEXT,
  qr_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (for public verification)
CREATE POLICY "Public read access" ON employees
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated insert" ON employees
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated update" ON employees
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated delete" ON employees
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for employee photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-photos', 'employee-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'employee-photos');

-- Storage policy: Allow authenticated upload
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'employee-photos' AND
    auth.role() = 'authenticated'
  );

-- Storage policy: Allow authenticated update
CREATE POLICY "Authenticated update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'employee-photos' AND
    auth.role() = 'authenticated'
  );

-- Storage policy: Allow authenticated delete
CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'employee-photos' AND
    auth.role() = 'authenticated'
  );

