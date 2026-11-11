import { NextResponse } from "next/server";
import { getIdentity } from "../../../../cursor/identity";
import { ensureViewerUser, usingSampleStore } from "@/lib/store";

export async function GET(request: Request) {
  const identity = await getIdentity(request);
  if (!identity.verified) {
    return NextResponse.json({
      signedIn: false,
      sampleData: usingSampleStore(),
    });
  }
  if (identity.kind !== "person") {
    return NextResponse.json({
      signedIn: false,
      sampleData: usingSampleStore(),
    });
  }

  const user = await ensureViewerUser({
    sub: identity.sub,
    name: identity.name,
    email: identity.email,
  });

  return NextResponse.json({
    signedIn: true,
    simulated: identity.simulated,
    user,
    sampleData: usingSampleStore(),
  });
}
