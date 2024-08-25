import { Descendant } from "slate";
import { NodeType } from "../types";

export const defaultInitialValue: Descendant[] = [
  {
    type: NodeType.ORDERED_LIST,
    children: [
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "item 1" }],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "Item 2" }],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "Item 3" }],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "item 4" }],
      },
      {
        type: NodeType.LIST_ITEM,
        children: [{ text: "Item 5" }],
      },
    ],
  },
];
