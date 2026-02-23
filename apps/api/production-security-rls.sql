-- PRODUCTION SECURITY: RLS FOR CONTACT_MESSAGES

-- 1. Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Allow Public to INSERT (Lead capture from landing page)
CREATE POLICY "Public can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 3. Restrict SELECT to authenticated service roles or admins
-- Note: Replace 'authenticated' with specific role if needed
CREATE POLICY "Only admins can see contact messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'service_role');

-- 4. Restrict DELETE/UPDATE
CREATE POLICY "Only admins can manage contact messages" ON contact_messages
  FOR ALL USING (auth.role() = 'service_role');
