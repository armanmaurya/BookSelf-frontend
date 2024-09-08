import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { ParagraphElementType } from "./element";
import { ParagraphLeafType } from "./leaf";

declare module "slate" {
  interface CustomTypes {
    Element: ParagraphElementType;
    Editor: CustomEditor
    Text: ParagraphLeafType
    
  }
}

type CustomEditor = BaseEditor & ReactEditor

