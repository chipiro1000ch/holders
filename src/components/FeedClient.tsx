"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PostCard } from "./PostCard";
import { SampleBanner } from "./SampleBanner";
import type { PostWithAuthor } from "@/lib/types";

export function FeedClient() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [sampleData, setSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("フィードを取得できませんでした");
        const data = (await res.json()) as {
          posts: PostWithAuthor[];
          sampleData: boolean;
        };
        if (!cancelled) {
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
  }, []);

  if (loading) {
    return (
      <div className="feed-shell px-4 py-16 text-center text-ink-soft sm:px-0">
        フィードを読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-shell px-4 py-16 text-center text-ink-soft sm:px-0">
        {error}
      </div>
    );
  }

  return (
    <div className="feed-shell py-6">
      <section className="mb-8 px-4 sm:px-0">
        <p className="font-[family-name:var(--font-cinzel)] text-3xl font-semibold tracking-[0.18em] text-ink uppercase sm:text-4xl">
          Holders
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          メンズの時計とジュエリーに特化した、手元のコレクションを見せ合う場。
        </p>
        <div className="metal-line my-5" />
        <Link href="/new" className="btn-primary">
          新しい投稿
        </Link>
      </section>

      {sampleData ? <div className="px-4 sm:px-0"><SampleBanner /></div> : null}

      <div className="flex flex-col gap-8">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="px-4 py-12 text-center text-ink-soft sm:px-0">
          まだ投稿がありません。最初の一本をシェアしましょう。
        </p>
      ) : null}
    </div>
  );
}
