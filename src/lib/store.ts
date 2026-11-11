import * as memory from "./memory-store";
import * as sb from "./supabase-store";
import { hasSupabase } from "./supabase";
import type { Post, PostWithAuthor, User } from "./types";

export function usingSampleStore(): boolean {
  return !hasSupabase();
}

export async function listUsers(): Promise<User[]> {
  if (hasSupabase()) return sb.sbListUsers();
  return memory.memoryListUsers();
}

export async function getUserById(id: string): Promise<User | null> {
  if (hasSupabase()) return sb.sbGetUserById(id);
  return memory.memoryGetUserById(id);
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  if (hasSupabase()) return sb.sbGetUserByUsername(username);
  return memory.memoryGetUserByUsername(username);
}

export async function ensureViewerUser(input: {
  sub: string;
  name: string;
  email: string;
}): Promise<User> {
  if (hasSupabase()) return sb.sbUpsertCursorUser(input);
  return memory.memoryUpsertCursorUser(input);
}

export async function listPosts(): Promise<Post[]> {
  if (hasSupabase()) return sb.sbListPosts();
  return memory.memoryListPosts();
}

export async function listPostsByUser(userId: string): Promise<Post[]> {
  if (hasSupabase()) return sb.sbListPostsByUser(userId);
  return memory.memoryListPostsByUser(userId);
}

export async function createPost(input: {
  userId: string;
  imageUrl: string;
  caption: string;
}): Promise<Post> {
  if (hasSupabase()) return sb.sbCreatePost(input);
  return memory.memoryCreatePost(input);
}

export async function listPostsWithAuthors(
  userId?: string,
): Promise<PostWithAuthor[]> {
  const posts = userId ? await listPostsByUser(userId) : await listPosts();
  const users = await listUsers();
  const byId = new Map(users.map((u) => [u.id, u]));
  return posts.flatMap((post) => {
    const author = byId.get(post.userId);
    if (!author) return [];
    return [{ ...post, author }];
  });
}

export function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
