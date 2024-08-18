import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";
import { Tab } from "../base/Tab";
import { EditableTabsListContext } from "../../context/editableTabListContext";
import { Editor, Path, Transforms } from "slate";

export const EditableTab = (props: RenderElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const [startPos, setStartPos] = useState({ x: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0 });
  const editableTabListContext = useContext(EditableTabsListContext);
  const editor = useSlateStatic();

  const tabContext = useContext(EditableTabsContext);
  const { attributes, children, element } = props;
  const tabIndex =
    props.element.type === NodeType.TAB ? props.element.index : null;

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsDragging(true);
      const draggableElement = ref.current;
      if (draggableElement) {
        setStartPos({ x: draggableElement.getBoundingClientRect().x });
      }
      editableTabListContext.setDragStartIndex(tabIndex as number);
    },

    [position.x]
  );

  // const editableTabListContext = useContext();
  // editableTabListContext.path.push({
  //   index: tabIndex as number,
  //   path: ReactEditor.findPath(editor, element),
  // });

  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && ref.current) {
        ref.current.style.transition = "none";

        const newX = e.clientX - startPos.x;
        setPreviousPosition({ x: position.x });
        setPosition({
          x: newX,
        });

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
      console.log(position.x, currentPos);
      setPosition({ x: 0 });
      setIsDragging(false);
      const currentpath = ReactEditor.findPath(editor, element);
      const dragEndPath = [...currentpath.slice(0, -1), dragEndIndex];
      console.log("Current Path", currentpath, "Drag End Path", dragEndPath);
      Transforms.moveNodes(editor, {
        at: currentpath,
        to: dragEndPath as Path,
      });
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
  return (
    <div
      style={{
        transform: `translateX(${position.x}px)`,
        transition: "transform 0.2s",
      }}
      ref={ref}
      className="flex"
    >
      <button contentEditable={false} onMouseDown={onMouseDown}>
        ⠿
      </button>
      <Tab {...props} />
    </div>
  );
};
