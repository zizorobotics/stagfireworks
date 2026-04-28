create table products (
  id text primary key,
  name text not null,
  "videoUrl" text,
  "videoId" text,
  image text,
  description text,
  linked_video boolean,
  category text,
  specs jsonb
);

alter table products enable row level security;
create policy "Allow public read access" on products for select using (true);
