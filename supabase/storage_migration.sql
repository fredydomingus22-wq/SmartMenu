-- Create a new private bucket 'menu-assets'
insert into storage.buckets (id, name, public)
values ('menu-assets', 'menu-assets', true);

-- Allow public access to all files in the 'menu-assets' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'menu-assets' );

-- Allow authenticated users to upload files to 'menu-assets'
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'menu-assets' and auth.role() = 'authenticated' );

-- Allow authenticated users to update their own files (optional, but good practice)
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'menu-assets' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete their own files
create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'menu-assets' and auth.role() = 'authenticated' );
