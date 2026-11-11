"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const SUGGESTIONS = [
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1622434641406-a75bda6fd029?w=1200&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=1200&fit=crop&q=80",
];

export function NewPostForm() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [imageUrl, setImageUrl] = useState(SUGGESTIONS[0]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = (await res.json()) as { signedIn: boolean; user?: User };
        if (!cancelled && data.signedIn && data.user) setMe(data.user);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const previewOk = useMemo(() => {
    try {
      const url = new URL(imageUrl);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, [imageUrl]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "投稿に失敗しました");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="feed-shell space-y-5 px-4 py-8 sm:px-0">
      <div>
        <p className="font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.2em] uppercase">
          New Hold
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          手元の時計やジュエリーを一枚で。
          {ready
            ? me
              ? ` @${me.username} として投稿します。`
              : " サインインが必要です。"
            : ""}
        </p>
      </div>

      <div className="post-media rounded-[2px]">
        {previewOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="プレビュー" />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center text-sm text-stone">
            画像URLを入力するとプレビューされます
          </div>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="tracking-wide text-ink-soft">画像URL</span>
        <input
          className="field"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          required
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setImageUrl(url)}
            className="border border-[var(--line)] bg-white/60 px-3 py-1.5 text-xs text-ink-soft hover:border-metal hover:text-ink"
          >
            サンプル {i + 1}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="tracking-wide text-ink-soft">キャプション</span>
        <textarea
          className="field min-h-28 resize-y"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={500}
          placeholder="今日の一本、素材、シーンなど"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        className="btn-primary w-full sm:w-auto"
        disabled={saving || !me}
      >
        {saving ? "投稿中…" : "投稿する"}
      </button>
    </form>
  );
}
