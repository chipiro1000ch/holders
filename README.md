# Holders

メンズの時計・ジュエリーに特化した、シンプルな Instagram 風 SNS。

## いまできること

- フィード（投稿一覧）
- 投稿作成（画像URL + キャプション）
- ユーザープロフィール

## データ

- 秘密が未設定のときはサンプルデータ（メモリ）
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` があると Supabase に永続化

### Supabase セットアップ

1. プロジェクトを作成（Tokyo、expose OFF、RLS ON 推奨）
2. SQL Editor で `supabase/schema.sql` を実行
3. Cursor Secrets に `SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を追加

## 開発

```bash
npm install
npm run dev
```

## スタック

- Next.js (App Router)
- TypeScript / Tailwind CSS
- Supabase (Postgres)
