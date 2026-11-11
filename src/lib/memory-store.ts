import { SEED_POSTS, SEED_USERS } from "./seed";
import type { Post, User } from "./types";

type MemoryState = {
  users: User[];
  posts: Post[];
  seeded: boolean;
};

declare global {
  var __holdersMemory: MemoryState | undefined;
}

function state(): MemoryState {
  if (!globalThis.__holdersMemory) {
    globalThis.__holdersMemory = {
      users: structuredClone(SEED_USERS),
      posts: structuredClone(SEED_POSTS),
      seeded: true,
    };
  }
  return globalThis.__holdersMemory;
}

export function memoryListUsers(): User[] {
  return [...state().users].sort((a, b) => a.username.localeCompare(b.username));
}

export function memoryGetUserById(id: string): User | null {
  return state().users.find((u) => u.id === id) ?? null;
}

export function memoryGetUserByUsername(username: string): User | null {
  return (
    state().users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    ) ?? null
  );
}

export function memoryGetUserByCursorSub(sub: string): User | null {
  return state().users.find((u) => u.id === `cursor:${sub}`) ?? null;
}

export function memoryUpsertCursorUser(input: {
  sub: string;
  name: string;
  email: string;
}): User {
  const existing = memoryGetUserByCursorSub(input.sub);
  if (existing) return existing;

  const base =
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 12) || "holder";
  let username = base;
  let n = 1;
  while (memoryGetUserByUsername(username)) {
    username = `${base}${n}`;
    n += 1;
  }

  const user: User = {
    id: `cursor:${input.sub}`,
    username,
    displayName: input.name || input.email.split("@")[0] || "Holder",
    bio: "Holders に参加しました。時計とジュエリーを集めています。",
    avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(input.sub)}`,
    createdAt: new Date().toISOString(),
  };
  state().users.push(user);
  return user;
}

export function memoryListPosts(): Post[] {
  return [...state().posts].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function memoryListPostsByUser(userId: string): Post[] {
  return memoryListPosts().filter((p) => p.userId === userId);
}

export function memoryCreatePost(input: {
  userId: string;
  imageUrl: string;
  caption: string;
}): Post {
  const post: Post = {
    id: `post_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    imageUrl: input.imageUrl,
    caption: input.caption,
    createdAt: new Date().toISOString(),
  };
  state().posts.unshift(post);
  return post;
}
