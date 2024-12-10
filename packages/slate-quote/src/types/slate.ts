import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    // Element: CodeElementType
    Editor: CustomEditor
    // Text: CodeLeafType;
    
  }
}

type CustomEditor = BaseEditor & ReactEditor

