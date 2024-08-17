import { RenderElementProps } from "slate-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";
import { Tab } from "../base/Tab";

export const EditableTab = (props: RenderElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const [startPos, setStartPos] = useState({ x: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsDragging(true);
      const draggableElement = ref.current;
      if (draggableElement) {
        setStartPos({ x: draggableElement.getBoundingClientRect().x });
      }
    },
    [position.x]
  );

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
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        // Check for collision
        const draggableElement = ref.current;
        if (draggableElement && ref.current.parentElement) {
          const draggableRect = draggableElement.getBoundingClientRect();
          const allDivs = ref.current.parentElement.querySelectorAll("div");

          allDivs.forEach(async (div) => {
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
                } else if (
                  draggableRect.right > otherRect.left + otherRect.width / 2 &&
                  otherRect.x - currentTranslateX < startPos.x
                ) {
                  div.style.transform = `translateX(0px)`;
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
                } else if (
                  draggableRect.left < otherRect.right - otherRect.width / 2 &&
                  otherRect.x - currentTranslateX > startPos.x
                ) {
                  div.style.transform = `translateX(0px)`;
                }
              }
            }
          });
        }
      }
    },
    [isDragging, position.x]
  );
  const onMouseUp = useCallback(() => {
    if (ref.current && ref.current.parentElement) {
      const allDivs = ref.current.parentElement.querySelectorAll("div");
      allDivs.forEach((div) => {
        div.style.transition = "transform 0.2s";
        div.style.transform = `translateX(0px)`;
      });
    }
    setPosition({ x: 0 });
    setIsDragging(false);
  }, []);

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
      style={{ transform: `translateX(${position.x}px)` }}
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
