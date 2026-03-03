-- Enable Supabase Realtime for the orders table
-- Run this in Supabase SQL Editor or as a migration

-- Add the orders table to the Supabase Realtime publication
-- This is equivalent to toggling the table in Dashboard → Database → Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Verify it was added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'orders';
