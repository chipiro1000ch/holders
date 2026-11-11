"use client";

import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { SampleBanner } from "./SampleBanner";
import type { PostWithAuthor, User } from "@/lib/types";

type Props = {
  username: string;
};

export function ProfileClient({ username }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [sampleData, setSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
        if (res.status === 404) throw new Error("ユーザーが見つかりません");
        if (!res.ok) throw new Error("プロフィールを取得できませんでした");
        const data = (await res.json()) as {
          user: User;
          posts: PostWithAuthor[];
          sampleData: boolean;
        };
        if (!cancelled) {
          setUser(data.user);
          setPosts(data.posts);
          setSampleData(data.sampleData);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "エラーが発生しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="feed-shell px-4 py-16 text-center text-ink-soft sm:px-0">
        プロフィールを読み込み中…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="feed-shell px-4 py-16 text-center text-ink-soft sm:px-0">
        {error || "ユーザーが見つかりません"}
      </div>
    );
  }

  return (
    <div className="feed-shell py-8">
      <section className="mb-8 flex items-start gap-4 px-4 sm:px-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl}
          alt=""
          className="h-20 w-20 rounded-full object-cover ring-1 ring-[var(--line)]"
        />
        <div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.12em]">
            {user.displayName}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">@{user.username}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
            {user.bio}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-metal-deep">
            {posts.length} posts
          </p>
        </div>
      </section>

      <div className="metal-line mb-6" />
      {sampleData ? (
        <div className="px-4 sm:px-0">
          <SampleBanner />
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
