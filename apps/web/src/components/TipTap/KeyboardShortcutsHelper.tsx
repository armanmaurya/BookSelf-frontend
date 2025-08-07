import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from './constants';

const KeyboardShortcutsHelper = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <PerfectScrollbar
            options={{
              wheelSpeed: 0.5,
              wheelPropagation: false,
              suppressScrollX: true,
              minScrollbarLength: 20,
            }}
            style={{ maxHeight: '55vh' }}
          >
            <div className="grid gap-6 py-4 pr-2">
              {KEYBOARD_SHORTCUTS.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {category.category}
                  </h3>
                  <div className="grid gap-2">
                    {category.items.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50">
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-xs text-muted-foreground">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PerfectScrollbar>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelper;
