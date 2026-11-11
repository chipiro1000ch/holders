import { NextResponse } from "next/server";
import { listUsers, usingSampleStore } from "@/lib/store";

export async function GET() {
  const users = await listUsers();
  return NextResponse.json({
    users,
    sampleData: usingSampleStore(),
  });
}
