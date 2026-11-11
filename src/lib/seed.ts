import type { Post, User } from "./types";

export const SEED_USERS: User[] = [
  {
    id: "user_kenji",
    username: "kenji.steel",
    displayName: "Kenji Nakamura",
    bio: "機械式とシルバーリング。東京 / 銀座まわりで撮影。",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "user_marcus",
    username: "marcus.hold",
    displayName: "Marcus Hale",
    bio: "Dive watches & chain bracelets. Less talk, more steel.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    createdAt: "2026-01-08T11:20:00.000Z",
  },
  {
    id: "user_rio",
    username: "rio.cuff",
    displayName: "Rio Tanaka",
    bio: "カフとシグネット。手元のディテールを集めています。",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    createdAt: "2026-01-12T14:40:00.000Z",
  },
];

export const SEED_POSTS: Post[] = [
  {
    id: "post_1",
    userId: "user_kenji",
    imageUrl:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1200&fit=crop&q=80",
    caption: "朝の光に乗ったブラッシュドケース。今日の一振り。",
    createdAt: "2026-03-01T02:10:00.000Z",
  },
  {
    id: "post_2",
    userId: "user_marcus",
    imageUrl:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&h=1200&fit=crop&q=80",
    caption: "Black dial, quiet flex. Weekend kit.",
    createdAt: "2026-03-02T08:30:00.000Z",
  },
  {
    id: "post_3",
    userId: "user_rio",
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=1200&fit=crop&q=80",
    caption: "シルバーカフ。袖口から少しだけ見せるのが好み。",
    createdAt: "2026-03-03T05:45:00.000Z",
  },
  {
    id: "post_4",
    userId: "user_kenji",
    imageUrl:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1200&h=1200&fit=crop&q=80",
    caption: "ゴールドとネイビー。夜のダイバー。",
    createdAt: "2026-03-04T12:00:00.000Z",
  },
  {
    id: "post_5",
    userId: "user_marcus",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=1200&fit=crop&q=80",
    caption: "Chain weight that sits right under the cuff.",
    createdAt: "2026-03-05T16:20:00.000Z",
  },
  {
    id: "post_6",
    userId: "user_rio",
    imageUrl:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&h=1200&fit=crop&q=80",
    caption: "シグネットリング。刻印はまだ内緒。",
    createdAt: "2026-03-06T01:55:00.000Z",
  },
];
