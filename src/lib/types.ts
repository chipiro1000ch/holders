export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
};

export type Post = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

export type PostWithAuthor = Post & {
  author: User;
};
