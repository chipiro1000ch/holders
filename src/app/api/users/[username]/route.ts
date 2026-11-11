import { NextResponse } from "next/server";
import {
  getUserByUsername,
  listPostsWithAuthors,
  usingSampleStore,
} from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const user = await getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const posts = await listPostsWithAuthors(user.id);
  return NextResponse.json({
    user,
    posts,
    sampleData: usingSampleStore(),
  });
}
