export interface Article {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  slug: string;
}
