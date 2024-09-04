import { ParagraphElementType } from "./element";

declare module "slate" {
  interface CustomTypes {
    Element: ParagraphElementType;
  }
}
