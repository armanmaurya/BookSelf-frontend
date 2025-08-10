"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FontSelectionProps {
  editor: Editor;
  safeEditorState: any;
  customFontSize: string;
  setCustomFontSize: (size: string) => void;
}

const FontSelection = ({ 
  editor, 
  safeEditorState, 
  customFontSize, 
  setCustomFontSize 
}: FontSelectionProps) => {
  
  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const unsetFontFamily = () => {
    editor.chain().focus().unsetFontFamily().run();
  };

  const getCurrentFontFamily = () => {
    if (!safeEditorState) return "Default";
    if (safeEditorState.isInter) return "Inter";
    if (safeEditorState.isComicSans) return "Comic Sans MS";
    if (safeEditorState.isSerif) return "Serif";
    if (safeEditorState.isMonospace) return "Monospace";
    if (safeEditorState.isCursive) return "Cursive";
    if (safeEditorState.isSystemUI) return "System UI";
    if (safeEditorState.isArial) return "Arial";
    if (safeEditorState.isHelvetica) return "Helvetica";
    if (safeEditorState.isTimesNewRoman) return "Times New Roman";
    if (safeEditorState.isGeorgia) return "Georgia";
    if (safeEditorState.isVerdana) return "Verdana";
    if (safeEditorState.isTahoma) return "Tahoma";
    if (safeEditorState.isCourierNew) return "Courier New";
    if (safeEditorState.isTrebuchet) return "Trebuchet MS";
    if (safeEditorState.isImpact) return "Impact";
    if (safeEditorState.isPalatino) return "Palatino";
    if (safeEditorState.isRoboto) return "Roboto";
    if (safeEditorState.isOpenSans) return "Open Sans";
    if (safeEditorState.isLato) return "Lato";
    if (safeEditorState.isMontserrat) return "Montserrat";
    if (safeEditorState.isPoppins) return "Poppins";
    return "Default";
  };

  const setFontSize = (fontSize: string) => {
    editor.chain().focus().setFontSize(fontSize).run();
  };

  const unsetFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
  };

  const getCurrentFontSize = () => {
    return safeEditorState.currentFontSize || '16px';
  };

  const handleCustomFontSize = () => {
    if (customFontSize.trim() === '') return;
    
    // Parse the input to get numeric value
    const numericValue = parseInt(customFontSize);
    
    // Validate the input (reasonable font size range)
    if (isNaN(numericValue) || numericValue < 8 || numericValue > 72) {
      alert('Please enter a valid font size between 8px and 72px');
      return;
    }
    
    // Apply the font size
    setFontSize(`${numericValue}px`);
    setCustomFontSize(''); // Clear the input after applying
  };

  return (
    <>
      {/* Font Family Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-8 text-sm w-[90px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {getCurrentFontFamily()}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 max-h-80 overflow-y-auto"
        >
          <DropdownMenuItem
            onClick={() => unsetFontFamily()}
            className={
              getCurrentFontFamily() === "Default" ? "bg-accent" : ""
            }
          >
            <span className="font-normal">Default</span>
          </DropdownMenuItem>

          {/* Popular Web Fonts */}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
            Popular Web Fonts
          </div>
          <DropdownMenuItem
            onClick={() => setFontFamily("Inter")}
            className={safeEditorState.isInter ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Inter" }}>Inter</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Roboto")}
            className={safeEditorState.isRoboto ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Roboto, sans-serif" }}>Roboto</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Open Sans")}
            className={safeEditorState.isOpenSans ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: '"Open Sans", sans-serif' }}>
              Open Sans
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Lato")}
            className={safeEditorState.isLato ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Lato, sans-serif" }}>Lato</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Montserrat")}
            className={safeEditorState.isMontserrat ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Montserrat, sans-serif" }}>
              Montserrat
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Poppins")}
            className={safeEditorState.isPoppins ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Poppins, sans-serif" }}>Poppins</span>
          </DropdownMenuItem>

          {/* System Fonts */}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
            System Fonts
          </div>
          <DropdownMenuItem
            onClick={() => setFontFamily("Arial")}
            className={safeEditorState.isArial ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Arial, sans-serif" }}>Arial</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Helvetica")}
            className={safeEditorState.isHelvetica ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Helvetica, sans-serif" }}>
              Helvetica
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Verdana")}
            className={safeEditorState.isVerdana ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Verdana, sans-serif" }}>Verdana</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Tahoma")}
            className={safeEditorState.isTahoma ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Tahoma, sans-serif" }}>Tahoma</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Trebuchet MS")}
            className={safeEditorState.isTrebuchet ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
              Trebuchet MS
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("system-ui")}
            className={safeEditorState.isSystemUI ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "system-ui" }}>System UI</span>
          </DropdownMenuItem>

          {/* Serif Fonts */}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
            Serif Fonts
          </div>
          <DropdownMenuItem
            onClick={() => setFontFamily("Times New Roman")}
            className={safeEditorState.isTimesNewRoman ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: '"Times New Roman", serif' }}>
              Times New Roman
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Georgia")}
            className={safeEditorState.isGeorgia ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Palatino")}
            className={safeEditorState.isPalatino ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Palatino, serif" }}>Palatino</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("serif")}
            className={safeEditorState.isSerif ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "serif" }}>Serif</span>
          </DropdownMenuItem>

          {/* Monospace & Display Fonts */}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
            Monospace & Display
          </div>
          <DropdownMenuItem
            onClick={() => setFontFamily("Courier New")}
            className={safeEditorState.isCourierNew ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: '"Courier New", monospace' }}>
              Courier New
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("monospace")}
            className={safeEditorState.isMonospace ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "monospace" }}>Monospace</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("Impact")}
            className={safeEditorState.isImpact ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Impact, sans-serif" }}>Impact</span>
          </DropdownMenuItem>

          {/* Fun Fonts */}
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1">
            Fun Fonts
          </div>
          <DropdownMenuItem
            onClick={() => setFontFamily("Comic Sans MS, cursive")}
            className={safeEditorState.isComicSans ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Comic Sans
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontFamily("cursive")}
            className={safeEditorState.isCursive ? "bg-accent" : ""}
          >
            <span style={{ fontFamily: "cursive" }}>Cursive</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-8 text-sm w-[70px] overflow-hidden text-ellipsis whitespace-nowrap"
            title="Font Size"
          >
            {getCurrentFontSize().replace('px', '')}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            onClick={() => unsetFontSize()}
            className={getCurrentFontSize() === '16px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Default</span>
            <span className="text-muted-foreground">16px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('12px')}
            className={getCurrentFontSize() === '12px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Small</span>
            <span className="text-muted-foreground">12px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('14px')}
            className={getCurrentFontSize() === '14px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Normal</span>
            <span className="text-muted-foreground">14px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('16px')}
            className={getCurrentFontSize() === '16px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Medium</span>
            <span className="text-muted-foreground">16px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('18px')}
            className={getCurrentFontSize() === '18px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Large</span>
            <span className="text-muted-foreground">18px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('20px')}
            className={getCurrentFontSize() === '20px' ? "bg-accent" : ""}
          >
            <span className="mr-2">X-Large</span>
            <span className="text-muted-foreground">20px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('24px')}
            className={getCurrentFontSize() === '24px' ? "bg-accent" : ""}
          >
            <span className="mr-2">XX-Large</span>
            <span className="text-muted-foreground">24px</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFontSize('32px')}
            className={getCurrentFontSize() === '32px' ? "bg-accent" : ""}
          >
            <span className="mr-2">Huge</span>
            <span className="text-muted-foreground">32px</span>
          </DropdownMenuItem>
          
          <div className="border-t my-1" />
          
          {/* Custom Font Size Input */}
          <div className="px-2 py-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Custom Size</div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="16"
                min="8"
                max="72"
                value={customFontSize}
                onChange={(e) => setCustomFontSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomFontSize();
                  }
                }}
                className="h-7 text-xs w-16"
              />
              <span className="text-xs text-muted-foreground">px</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCustomFontSize}
                className="h-7 px-2 text-xs"
                disabled={!customFontSize.trim()}
              >
                Apply
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FontSelection;
