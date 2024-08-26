import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { TabList } from "../base/TabList";
import { EditableTabsListContext } from "../../context/editableTabListContext";
import { useState } from "react";
import { Node, Path, Transforms, Editor } from "slate";
import { IoIosAdd } from "react-icons/io";
import { NodeType } from "../../../../types";

export const EditableTabList = (props: RenderElementProps) => {
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [dragEndIndex, setDragEndIndex] = useState(0);
  const editor = useSlateStatic();

  const insertTab = () => {
    const lastchildPath = ReactEditor.findPath(
      editor,
      props.element.children[props.element.children.length - 1]
    );
    // console.log("insertPath", lastchildPath, "element", props.element);
    Transforms.insertNodes(
      editor,
      {
        type: NodeType.TAB,
        children: [{ text: "Untitled" }],
        index: lastchildPath[lastchildPath.length - 1] + 1,
      },
      {
        at: Path.next(lastchildPath),
        select: true,
      }
    );

    const parentNode = Editor.parent(
      editor,
      ReactEditor.findPath(editor, props.element)
    );
    const lastTabPanelPath = ReactEditor.findPath(
      editor,
      parentNode[0].children[parentNode[0].children.length - 1]
    );
    console.log("lastTabPanelPath", lastTabPanelPath);
    Transforms.insertNodes(
      editor,
      {
        type: NodeType.TAB_PANEL,
        children: [{ type: NodeType.PARAGRAPH, children: [{ text: "" }] }],
        index: lastchildPath[lastchildPath.length - 1] + 1,
      },
      {
        at: Path.next(lastTabPanelPath),
      }
    );
  };

  return (
    <EditableTabsListContext.Provider
      value={{
        dragStartIndex,
        setDragStartIndex,
        dragEndIndex,
        setDragEndIndex,
      }}
    >
      <div className="relative pr-10">
        <TabList {...props} />
        <div
          className="flex justify-center items-center absolute right-2 top-2 hover:cursor-pointern hover:bg-neutral-400 hover:bg-opacity-15 rounded-md"
          contentEditable={false}
          onMouseDown={(e) => {
            e.preventDefault();
            insertTab()}}
        >
          <IoIosAdd size={25} />
        </div>
      </div>
    </EditableTabsListContext.Provider>
  );
};
