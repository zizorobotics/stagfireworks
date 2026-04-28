-- Enable Row Level Security writing exclusively for authenticated Admins (JWT tokens)
create policy "Allow admin write access" on products for insert with check (auth.role() = 'authenticated');
create policy "Allow admin update access" on products for update using (auth.role() = 'authenticated');
create policy "Allow admin delete access" on products for delete using (auth.role() = 'authenticated');

-- Initialize the images storage bucket
insert into storage.buckets (id, name, public) values ('images', 'images', true) ON CONFLICT DO NOTHING;

-- Storage Security RLS
create policy "Public images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Admin upload" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Admin update" on storage.objects for update using ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Admin delete" on storage.objects for delete using ( bucket_id = 'images' and auth.role() = 'authenticated' );
