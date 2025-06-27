import { useEffect, useRef, useState } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Commands {
  name: string;
  command: (editor: Editor) => void;
  icon?: React.ReactNode;
  description?: string;
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
          if (domSelection) {
            setSelectCommand(0);
            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPos({ 
              top: rect.top + window.scrollY + 24, 
              left: rect.left + window.scrollX 
            });
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
    text = editor.string(editor.selection.anchor.path);
  }

  useEffect(() => {
    if (text === "") {
      setIsCommandMenuOpen(false);
    }
    sortMenuCommands(text.slice(1));
  }, [text]);

  const handleNavigation = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectCommand(prev => Math.min(prev + 1, MenuCommands.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectCommand(prev => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      MenuCommands[selectCommand].command(editor);
      setIsCommandMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isCommandMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    if (isCommandMenuOpen) {
      window.addEventListener("keydown", handleNavigation);
      return () => {
        window.removeEventListener("keydown", handleNavigation);
      };
    }
  }, [isCommandMenuOpen, selectCommand, MenuCommands]);

  return (
    <AnimatePresence>
      {isCommandMenuOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
          }}
          className="fixed z-[100] w-64 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 overflow-hidden"
        >
          <div className="p-1 max-h-80 overflow-y-auto">
            <div className="px-3 py-2 text-xs text-neutral-400 border-b border-neutral-700">
              Available commands
            </div>
            {MenuCommands.map((command, index) => (
              <motion.div
                key={index}
                initial={{ backgroundColor: "rgba(38, 38, 38, 0)" }}
                animate={{ 
                  backgroundColor: index === selectCommand ? "rgba(64, 64, 64, 1)" : "rgba(38, 38, 38, 0)" 
                }}
                className="flex items-center p-2 cursor-pointer rounded-md"
                onClick={() => {
                  if (isFocused) {
                    command.command(editor);
                    setIsCommandMenuOpen(false);
                  }
                }}
                onMouseEnter={() => setSelectCommand(index)}
              >
                {command.icon && (
                  <div className="flex items-center justify-center w-8 h-8 mr-2 bg-neutral-700 rounded-md text-neutral-300">
                    {command.icon}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-100">
                    {command.name}
                  </div>
                  {command.description && (
                    <div className="text-xs text-neutral-400">
                      {command.description}
                    </div>
                  )}
                </div>
                {index === selectCommand && (
                  <div className="text-xs text-neutral-400 px-2 py-1 bg-neutral-700 rounded">
                    Enter
                  </div>
                )}
              </motion.div>
            ))}
            {MenuCommands.length === 0 && (
              <div className="p-3 text-sm text-center text-neutral-400">
                No commands found
              </div>
            )}
          </div>
          <div className="px-3 py-2 text-xs text-neutral-500 border-t border-neutral-700">
            ↑↓ to navigate • Enter to select • Esc to dismiss
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};