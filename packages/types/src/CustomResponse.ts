import { Article } from "./Article";

export interface CustomResponse {
  data: Article;
  is_owner: boolean;
}
