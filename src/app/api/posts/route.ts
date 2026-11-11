import { NextResponse } from "next/server";
import { requireIdentity } from "../../../../cursor/identity";
import {
  createPost,
  ensureViewerUser,
  isValidImageUrl,
  listPostsWithAuthors,
  usingSampleStore,
} from "@/lib/store";

export async function GET() {
  const posts = await listPostsWithAuthors();
  return NextResponse.json({
    posts,
    sampleData: usingSampleStore(),
  });
}

export async function POST(request: Request) {
  const identity = await requireIdentity(request);
  if (identity instanceof Response) return identity;
  if (identity.kind !== "person") {
    return NextResponse.json({ error: "Person identity required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl =
    typeof body === "object" && body && "imageUrl" in body
      ? String((body as { imageUrl: unknown }).imageUrl ?? "").trim()
      : "";
  const caption =
    typeof body === "object" && body && "caption" in body
      ? String((body as { caption: unknown }).caption ?? "").trim()
      : "";

  if (!imageUrl || !isValidImageUrl(imageUrl)) {
    return NextResponse.json(
      { error: "https の画像URLを入力してください" },
      { status: 400 },
    );
  }
  if (caption.length > 500) {
    return NextResponse.json(
      { error: "キャプションは500文字以内にしてください" },
      { status: 400 },
    );
  }

  const user = await ensureViewerUser({
    sub: identity.sub,
    name: identity.name,
    email: identity.email,
  });

  const post = await createPost({
    userId: user.id,
    imageUrl,
    caption,
  });

  return NextResponse.json(
    {
      post: { ...post, author: user },
      sampleData: usingSampleStore(),
    },
    { status: 201 },
  );
}
