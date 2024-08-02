export interface CustomResponse {
  data: Article;
  is_owner: boolean;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
  slug: string;
  tags: string[];
}
