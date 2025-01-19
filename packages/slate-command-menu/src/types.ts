import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

// declare module "slate" {
//   interface CustomTypes {
//     Editor: CustomEditor
    
//   }
// }
type CustomEditorType = { type ? : string}
type CustomEditor = BaseEditor & ReactEditor & CustomEditorType