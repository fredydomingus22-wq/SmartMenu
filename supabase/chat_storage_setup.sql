-- Create a new public bucket 'chat-attachments'
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do nothing;

-- Allow public access to all files in the 'chat-attachments' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'chat-attachments' );

-- Allow authenticated users to upload files to 'chat-attachments'
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );

-- Allow authenticated users to update their own files
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete their own files
create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );
