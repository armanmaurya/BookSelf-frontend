import {
  Editor as SlateEditor,
  Transforms,
  Element as SlateElement,
} from "slate";
import { selectPanel } from "./transforms/selectPanel";
import { removeTab } from "./transforms/removeTab";
import { insertTab } from "./transforms/insertTab";

export const TabEditor = {
  removeTab,
  selectPanel,
  insertTab,
};
