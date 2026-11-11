import { getSupabaseAdmin } from "./supabase";
import type { Post, User } from "./types";

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
};

type PostRow = {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    userId: row.user_id,
    imageUrl: row.image_url,
    caption: row.caption,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function sbListUsers(): Promise<User[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*")
    .order("username", { ascending: true });
  if (error) throw error;
  return (data as UserRow[]).map(mapUser);
}

export async function sbGetUserById(id: string): Promise<User | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapUser(data as UserRow) : null;
}

export async function sbGetUserByUsername(
  username: string,
): Promise<User | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  return data ? mapUser(data as UserRow) : null;
}

export async function sbUpsertCursorUser(input: {
  sub: string;
  name: string;
  email: string;
}): Promise<User> {
  const id = `cursor:${input.sub}`;
  const existing = await sbGetUserById(id);
  if (existing) return existing;

  const base =
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 12) || "holder";
  let username = base;
  let n = 1;
  while (await sbGetUserByUsername(username)) {
    username = `${base}${n}`;
    n += 1;
  }

  const user: User = {
    id,
    username,
    displayName: input.name || input.email.split("@")[0] || "Holder",
    bio: "Holders に参加しました。時計とジュエリーを集めています。",
    avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(input.sub)}`,
    createdAt: new Date().toISOString(),
  };

  const { error } = await getSupabaseAdmin().from("users").insert({
    id: user.id,
    username: user.username,
    display_name: user.displayName,
    bio: user.bio,
    avatar_url: user.avatarUrl,
    created_at: user.createdAt,
  });
  if (error) throw error;
  return user;
}

export async function sbListPosts(): Promise<Post[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(mapPost);
}

export async function sbListPostsByUser(userId: string): Promise<Post[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(mapPost);
}

export async function sbCreatePost(input: {
  userId: string;
  imageUrl: string;
  caption: string;
}): Promise<Post> {
  const post: Post = {
    id: `post_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    imageUrl: input.imageUrl,
    caption: input.caption,
    createdAt: new Date().toISOString(),
  };
  const { error } = await getSupabaseAdmin().from("posts").insert({
    id: post.id,
    user_id: post.userId,
    image_url: post.imageUrl,
    caption: post.caption,
    created_at: post.createdAt,
  });
  if (error) throw error;
  return post;
}
