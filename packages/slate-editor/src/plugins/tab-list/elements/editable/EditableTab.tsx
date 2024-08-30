import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";
import { Tab } from "../base/Tab";
import { EditableTabsListContext } from "../../context/editableTabListContext";
import {
  Editor as SlateEditor,
  Path,
  Transforms,
  Element as SlateElement,
} from "slate";

import { IoClose } from "react-icons/io5";
import { TabEditor } from "../../tab-editor";

export const EditableTab = (props: RenderElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const [startPos, setStartPos] = useState({ x: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0 });
  const editableTabListContext = useContext(EditableTabsListContext);
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();
  // console.log(ReactEditor.findPath(editor, props.element));
  const ref = useRef<HTMLDivElement>(null);

  const tabContext = useContext(EditableTabsContext);
  const { attributes, children, element } = props;
  // const tabIndex =

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      console.log("Mouse Down");
      setIsDragging(true);
      tabContext.setActiveIndex(
        (props.element.type === NodeType.TAB
          ? props.element.index
          : null) as number
      );
      // console.log("Active Index", (props.element.type === NodeType.TAB ? props.element.index : null));
      const draggableElement = ref.current;
      if (draggableElement && ref.current.parentElement) {
        const allDivs = ref.current.parentElement.querySelectorAll("div");
        allDivs.forEach((div, index) => {
          if (div === ref.current) {
            tabContext.setActiveIndex(index);
          }
        });

        setStartPos({ x: draggableElement.getBoundingClientRect().x });
      }
      editableTabListContext.setDragStartIndex(
        (props.element.type === NodeType.TAB
          ? props.element.index
          : null) as number
      );
      console.log("New Move");
    },

    [position.x]
  );

  // const editableTabListContext = useContext();
  // editableTabListContext.path.push({
  //   index: tabIndex as number,
  //   path: ReactEditor.findPath(editor, element),
  // });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      console.log("Mouse Move");
      if (isDragging && ref.current) {
        ref.current.style.transition = "none";

        const newX = e.clientX - startPos.x;
        setPreviousPosition({ x: position.x });
        setPosition({
          x: newX,
        });
        console.log("Mouse Move");

        // Check for collision
        const draggableElement = ref.current;
        if (draggableElement && ref.current.parentElement) {
          const draggableRect = draggableElement.getBoundingClientRect();
          const allDivs = ref.current.parentElement.querySelectorAll("div");

          allDivs.forEach(async (div, index) => {
            if (div !== ref.current) {
              const otherRect = div.getBoundingClientRect();
              if (newX - previousPosition.x > 0) {
                const currentTransform = window.getComputedStyle(div).transform;
                const currentTranslateX = parseFloat(
                  currentTransform.split(",")[4]
                );

                // console.log("Forwadring Dragging");
                div.style.transition = "transform 0.1s";
                if (
                  draggableRect.right >
                    otherRect.x +
                      otherRect.width / 2 +
                      0.25 * otherRect.width &&
                  otherRect.x > startPos.x &&
                  currentTranslateX == 0
                ) {
                  div.style.transform = `translateX(-${draggableRect.width}px)`;
                  // console.log(index)
                } else if (
                  draggableRect.right > otherRect.left + otherRect.width / 2 &&
                  otherRect.x - currentTranslateX < startPos.x
                ) {
                  div.style.transform = `translateX(0px)`;
                  // console.log(index)
                }
              } else if (newX - previousPosition.x < 0) {
                const currentTransform = window.getComputedStyle(div).transform;
                const currentTranslateX = parseFloat(
                  currentTransform.split(",")[4]
                );
                div.style.transition = "transform 0.1s";
                // console.log("Backward Dragging");

                if (
                  draggableRect.left <
                    otherRect.x +
                      (otherRect.width / 2 - 0.25 * otherRect.width) &&
                  otherRect.x < startPos.x &&
                  currentTranslateX == 0
                ) {
                  div.style.transform = `translateX(${draggableRect.width}px)`;
                  // console.log(index)
                } else if (
                  draggableRect.left < otherRect.right - otherRect.width / 2 &&
                  otherRect.x - currentTranslateX > startPos.x
                ) {
                  div.style.transform = `translateX(0px)`;
                  // console.log(index)
                }
              }
            }
          });
        }
      }
    },
    [isDragging, position.x]
  );
  const onMouseUp = () => {
    let dragEndIndex = 0;
    let currentPos = 0;
    if (ref.current && ref.current.parentElement) {
      const allDivs = ref.current.parentElement.querySelectorAll("div");
      const currentRect = ref.current.getBoundingClientRect();
      allDivs.forEach((div, index) => {
        const otherRect = div.getBoundingClientRect();
        const currentTransform = window.getComputedStyle(div).transform;
        const currentTranslateX = parseFloat(currentTransform.split(",")[4]);

        // get all the previous divs
        if (otherRect.x < currentRect.x) {
          dragEndIndex += 1;
        }
        // if (otherRect.x > startPos.x && currentRect.x > otherRect.x) {
        //   // console.log(otherRect.x, startPos.x);
        //   currentPos += otherRect.width;
        // }
        // if (otherRect.x < startPos.x) {
        //   currentPos += otherRect.width;
        // }
        // div.style.transform = `translateX(0px)`;
      });
      // console.log(position.x, currentPos);
      setPosition({ x: 0 });
      setIsDragging(false);
      const currentpath = ReactEditor.findPath(editor, element);
      const dragEndPath = [...currentpath.slice(0, -1), dragEndIndex];
      // console.log("Current Path", currentpath, "Drag End Path", dragEndPath);
      Transforms.moveNodes(editor, {
        at: currentpath,
        to: dragEndPath as Path,
      });
      const currentTabPanelPath = [
        ...currentpath.slice(0, -2),
        currentpath[currentpath.length - 1] + 1,
      ];
      const dragEndTabPanelPath = [
        ...currentTabPanelPath.slice(0, -1),
        dragEndIndex + 1,
      ];
      console.log(
        "Current Tab Panel Path",
        currentTabPanelPath,
        "Drag End Tab Panel Path",
        dragEndTabPanelPath
      );
      Transforms.moveNodes(editor, {
        at: currentTabPanelPath,
        to: dragEndTabPanelPath as Path,
      });

      const allTab = SlateEditor.nodes(editor, {
        mode: "lowest",
        at: Path.parent(currentpath),
        match(node, path) {
          return SlateElement.isElement(node) && NodeType.TAB === node.type;
        },
      });
      const allTabPanel = SlateEditor.nodes(editor, {
        mode: "lowest",
        at: Path.parent(currentTabPanelPath),
        match(node, path) {
          return (
            SlateElement.isElement(node) && NodeType.TAB_PANEL === node.type
          );
        },
      });

      // let index = 0;
      // for (const tab of allTab) {
      //   Transforms.setNodes(
      //     editor,
      //     { index: index },
      //     { at: tab[1], match: (node) => NodeType.TAB === node.type }
      //   );
      //   index += 1;
      //   // console.log("All Tab", tab);
      // }
      // index = 0;
      // for (const tabPanel of allTabPanel) {
      //   Transforms.setNodes(
      //     editor,
      //     { index: index },
      //     { at: tabPanel[1], match: (node) => NodeType.TAB_PANEL === node.type }
      //   );
      //   index += 1;
      //   // console.log("All Tab Panel", tabPanel);
      // }
      tabContext.setActiveIndex(dragEndIndex);

      allDivs.forEach((div, index) => {
        const otherRect = div.getBoundingClientRect();
        if (div !== ref.current) {
          if (otherRect.x < currentRect.x) {
            div.style.transition = "";
            div.style.transform = `translateX(0px)`;
            return;
          }
          div.style.transition = "transform 0.2s";
          div.style.transform = `translateX(0px)`;
        } else {
          // div.style.transition = "transform 0.2s";
          // div.style.transform = `translateX(0px)`;
        }
      });
    }

    // console.log(editableTabListContext.dragStartIndex);
  };

  useEffect(() => {
    if (selected) {
      tabContext.setActiveIndex(
        (props.element.type === NodeType.TAB
          ? props.element.index
          : null) as number
      );
      smoothScrollToView(ref);
      window.addEventListener("keydown", keyDownEvent);
    } else {
      window.removeEventListener("keydown", keyDownEvent);
    }
    return () => {
      window.removeEventListener("keydown", keyDownEvent);
    };
  }, [selected]);

  const smoothScrollToView = (
    itemRef: React.RefObject<HTMLDivElement>
  ): void => {
    if (itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const onDragButtonClick = () => {};

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  // ########################### Keyboard Event #################################
  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      TabEditor.selectPanel(editor);
    }
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
    }
    if (e.key === "Delete") {
      const string = SlateEditor.string(
        editor,
        ReactEditor.findPath(editor, element)
      );
      if (string.length === 0) {
        e.preventDefault();
        TabEditor.removeTab(editor);
        return;
      }
      if (editor.selection?.anchor.offset === string.length) {
        e.preventDefault();
      }
    }
    if (e.altKey && e.key === "t") {
      e.preventDefault();
      TabEditor.insertTab(editor);
    }
  };
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

  // ########################### Keyboard Event #################################

  return (
    <div
      style={{
        transform: `translateX(${position.x}px)`,
        transition: "transform 0.2s",
      }}
      ref={ref}
      className="flex"
    >
      <button
        contentEditable={false}
        onMouseDown={onMouseDown}
        className="opa"
        onClick={onDragButtonClick}
      >
        ⠿
      </button>
      <Tab {...props} />

      {/* <div className="right-2 absolute top-3 bg-black rounded-full"><IoClose/></div> */}
    </div>
  );
};
