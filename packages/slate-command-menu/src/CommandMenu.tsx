import { useEffect, useRef, useState } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";

export interface Commands {
  name: string;
  command: (editor: Editor) => void;
}

export const CommandMenu = ({
  commands,
  isCommandMenuOpen,
  setIsCommandMenuOpen,
}: {
  commands: Commands[];
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (isOpen: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [MenuCommands, setMenuCommands] = useState<Commands[]>(commands);
  const editor = useSlate();
  const isFocused = useFocused();
  const [selectCommand, setSelectCommand] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsCommandMenuOpen(false);
    } else if (event.key === "/") {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const isStart = Editor.isStart(
          editor,
          editor.selection.anchor,
          editor.selection.anchor.path
        );
        if (isStart) {
          setIsCommandMenuOpen(true);
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            setSelectCommand(0);
            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPos({ top: rect.top, left: rect.left });
          }
        }
      }
    }
  };

  const sortMenuCommands = (command: string) => {
    if (MenuCommands) {
      const sortedCommands = [...MenuCommands].sort((a, b) => {
        const getMatchScore = (name: string, command: string) => {
          let score = 0;
          let commandIndex = 0;
          for (let i = 0; i < name.length; i++) {
            if (name[i] === command[commandIndex]) {
              score++;
              commandIndex++;
            }
            if (commandIndex === command.length) break;
          }
          return score;
        };

        const aScore = getMatchScore(a.name.toLowerCase(), command.toLowerCase());
        const bScore = getMatchScore(b.name.toLowerCase(), command.toLowerCase());

        return bScore - aScore;
      });
      setMenuCommands(sortedCommands);
    }
  };

  let text = "";
  if (editor.selection) {
    text = Editor.string(editor, editor.selection.anchor.path);
  }

  useEffect(() => {
    if (text === "") {
      setIsCommandMenuOpen(false);
    } else {
      sortMenuCommands(text.slice(1));
    }
  }, [text]);

  const handleNavigation = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (selectCommand < MenuCommands.length - 1) {
        setSelectCommand(selectCommand + 1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (selectCommand > 0) {
        setSelectCommand(selectCommand - 1);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      MenuCommands[selectCommand].command(editor);
      setIsCommandMenuOpen(false);
    }
  };

  useEffect(() => {
    const keyDownHandler = isCommandMenuOpen ? handleNavigation : handleKeyDown;
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [isCommandMenuOpen, selectCommand]);

  return (
    <>
      {isCommandMenuOpen && (
        <div
          ref={ref}
          style={{
            top: pos.top,
            left: pos.left,
          }}
          className="absolute p-2 bg-neutral-700 rounded-lg mt-6"
        >
          {MenuCommands.map((command, index) => {
            return (
              <div
                key={index}
                className={`p-1 cursor-pointer hover:bg-neutral-600 rounded-md ${index === selectCommand ? "bg-neutral-600" : ""
                  }`}
                onClick={() => {
                  if (isFocused) {
                    command.command(editor);
                  }
                }}
              >
                {command.name}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
