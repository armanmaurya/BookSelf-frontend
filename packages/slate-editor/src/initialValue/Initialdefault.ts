import { Descendant } from "slate";
import { NodeType } from "../types";

export const defaultInitialValue: Descendant[] = [
  {
    type: NodeType.PARAGRAPH,
    children: [{ text: "" }],
    align: "left",
  },
];
