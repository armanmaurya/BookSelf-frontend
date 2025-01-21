import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { HeadingElementType } from "./element";
import { HeadingLeafType } from "./leaf";
import { HeadingEditor } from "../editor/HeadingEditor";

declare module "slate" {
  interface CustomTypes {
    Element: HeadingElementType;
    Editor: CustomEditor
    Text: HeadingLeafType
  }
}

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & HeadingEditor
