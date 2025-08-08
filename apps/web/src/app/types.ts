export interface Article {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    isSelf: boolean; // Indicates if the author is the current user
  };
  createdAt: string;
  slug: string;
  isLiked: boolean; // Indicates if the article is liked by the user
  likesCount: number; // Number of likes
  views: number; // Number of views
  savesCount: number; // Number of times the article is saved
}
