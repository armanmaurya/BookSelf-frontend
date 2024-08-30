import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useSlateStatic,
} from "slate-react";
import { TabPanel } from "../base/TabPanel";
import { useCallback, useEffect } from "react";

export const EditableTabPanel = (props: RenderElementProps) => {
  const editor = useSlateStatic();
  const { attributes, children, element } = props;
  // console.log(ReactEditor.findPath(editor, props.element));
  const selected = useSelected();

  // const keyDownEvent = useCallback((e: KeyboardEvent) => {
  //   if (e.key === "Delete") {
  //     e.preventDefault();
  //     console.log("Delete");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (selected) {
  //     window.addEventListener("keydown", keyDownEvent);
  //   } else {
  //     window.removeEventListener("keydown", keyDownEvent);
  //   }
  //   return () => {
  //     window.removeEventListener("keydown", keyDownEvent);
  //   };
  // }, [selected]);
  return (
    <div {...attributes}>
      <TabPanel {...props} />
    </div>
  );
};
