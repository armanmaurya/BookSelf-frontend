export interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
  slug: string;
  tags: string[];
  likes: number;
  liked: boolean;
  username: string
}
