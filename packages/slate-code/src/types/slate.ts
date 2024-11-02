import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { CodeElementType } from "./element";
import { CodeLeafType } from "./leaf";

declare module "slate" {
  interface CustomTypes {
    Element: CodeElementType;
    Editor: CustomEditor
    Text: CodeLeafType;
    
  }
}

type CustomEditor = BaseEditor & ReactEditor

