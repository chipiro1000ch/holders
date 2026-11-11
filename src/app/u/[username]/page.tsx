import { Suspense } from "react";
import { ProfileClient } from "@/components/ProfileClient";

type Props = {
  params: Promise<{ username: string }>;
};

async function ProfileBody({ params }: Props) {
  const { username } = await params;
  return <ProfileClient username={username} />;
}

export default function ProfilePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="feed-shell px-4 py-16 text-center text-ink-soft sm:px-0">
          プロフィールを読み込み中…
        </div>
      }
    >
      <ProfileBody params={params} />
    </Suspense>
  );
}
