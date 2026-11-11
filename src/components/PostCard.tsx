import Link from "next/link";
import type { PostWithAuthor } from "@/lib/types";

type Props = {
  post: PostWithAuthor;
  index?: number;
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PostCard({ post, index = 0 }: Props) {
  return (
    <article
      className="animate-rise border-b border-[var(--line)] pb-8"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="mb-3 flex items-center gap-3 px-4 sm:px-0">
        <Link href={`/u/${post.author.username}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--line)]"
          />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/u/${post.author.username}`}
            className="block truncate text-sm font-medium tracking-wide"
          >
            {post.author.displayName}
          </Link>
          <p className="truncate text-xs text-ink-soft">
            @{post.author.username} · {formatTime(post.createdAt)}
            <span className="sr-only"> Asia/Tokyo</span>
          </p>
        </div>
      </div>

      <div className="post-media sm:rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.imageUrl} alt={post.caption || "Holders post"} />
      </div>

      {post.caption ? (
        <p className="mt-3 px-4 text-[0.95rem] leading-relaxed text-ink sm:px-0">
          <Link
            href={`/u/${post.author.username}`}
            className="mr-2 font-medium tracking-wide"
          >
            {post.author.username}
          </Link>
          {post.caption}
        </p>
      ) : null}
    </article>
  );
}
