"use client";

import { useEffect, useRef, useState } from "react";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import BaseImage from "@tiptap/extension-image";

// React NodeView that renders the image with a resize handle
function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef<number>(node?.attrs?.width ?? 0);

  // Mouse handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startXRef.current;
      const baseWidth = startWidthRef.current || (wrapperRef.current?.getBoundingClientRect().width ?? 0);
      let newWidth = Math.round(baseWidth + deltaX);

      // Clamp width to sensible bounds
      const parentWidth = wrapperRef.current?.parentElement?.getBoundingClientRect().width ?? 1000;
      const min = 80;
      const max = Math.min(1024, Math.max(parentWidth - 24, min));
      newWidth = Math.max(min, Math.min(max, newWidth));

      updateAttributes({ width: newWidth });
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // Reset starting values to the newly applied width
        startWidthRef.current = node?.attrs?.width ?? startWidthRef.current;
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, node?.attrs?.width, updateAttributes]);

  const onHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If currently full width, exit full width mode when user starts resizing
    if (node?.attrs?.fullWidth) {
      updateAttributes({ fullWidth: false });
    }
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = node?.attrs?.width ?? (wrapperRef.current?.getBoundingClientRect().width ?? 0);
  };

  const width = node?.attrs?.width as number | null;
  const align = (node?.attrs?.align as 'left' | 'center' | 'right' | null) ?? null;
  const fullWidth = !!node?.attrs?.fullWidth;

  // Compute wrapper style based on alignment
  const wrapperStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : width ? `${width}px` : undefined,
  };
  if (fullWidth) {
    wrapperStyle.display = 'block';
    wrapperStyle.marginLeft = 'auto';
    wrapperStyle.marginRight = 'auto';
    wrapperStyle.clear = 'both';
    // Remove floats if any
    (wrapperStyle as any).float = 'none';
  } else if (align === 'center') {
    wrapperStyle.display = 'block';
    wrapperStyle.marginLeft = 'auto';
    wrapperStyle.marginRight = 'auto';
    // Prevent overlapping with floats above
    wrapperStyle.clear = 'both';
  } else if (align === 'left') {
    // Float left and add right margin for text wrap
    (wrapperStyle as any).float = 'left';
    wrapperStyle.marginRight = 16;
    wrapperStyle.marginBottom = 8;
  } else if (align === 'right') {
    (wrapperStyle as any).float = 'right';
    wrapperStyle.marginLeft = 16;
    wrapperStyle.marginBottom = 8;
  }

  return (
    <NodeViewWrapper
      as="div"
      className={`relative inline-block group ${selected ? "outline outline-2 outline-primary/60" : ""}`}
      ref={wrapperRef}
      // Use explicit width if set, otherwise let it size naturally, and apply alignment
      style={wrapperStyle}
      data-drag-handle
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        title={node.attrs.title || ""}
        style={{ display: "block", width: "100%", height: "auto", borderRadius: 8 }}
        className="shadow-sm"
        draggable={false}
      />

      {/* Resize handle */}
      <div
        onMouseDown={onHandleMouseDown}
        className="absolute bottom-1 right-1 h-3 w-3 rounded-sm bg-primary shadow-md cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to resize"
      />
    </NodeViewWrapper>
  );
}

// TipTap extension that extends the base Image to support width + alignment and a custom NodeView
export const ResizableImage = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const styleWidth = element.style.width;
          const dataWidth = element.getAttribute("data-width");
          const value = dataWidth || styleWidth;
          if (!value) return null;
          const match = /([0-9]+)px/.exec(value);
          return match ? Number(match[1]) : Number(value);
        },
        // Persist only data-width here; the style will be constructed in the align renderHTML
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.width) return {};
          return { 'data-width': attributes.width } as Record<string, string>;
        },
      },
      fullWidth: {
        default: false,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('data-full-width') === 'true';
        },
        // Keep only data attribute here; styles are built in align.renderHTML
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.fullWidth) return {};
          return { 'data-full-width': 'true' } as Record<string, string>;
        },
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('data-align') as 'left' | 'center' | 'right' | null;
        },
        renderHTML: (attributes: Record<string, any>) => {
          const rules: Record<string, string> = {};
          const styles: string[] = [];
          // Full width takes priority
          if (attributes.fullWidth) {
            styles.push('width: 100%; height: auto; display: block; clear: both;');
          } else if (attributes.width) {
            const width = typeof attributes.width === 'number' ? `${attributes.width}px` : String(attributes.width);
            styles.push(`width: ${width}; height: auto;`);
          }
          // Alignment styles applied directly to the img when rendered as HTML
          if (attributes.align === 'center') {
            styles.push('display: block; margin-left: auto; margin-right: auto; clear: both;');
          } else if (attributes.align === 'left') {
            styles.push('float: left; margin: 0 1rem 0.5rem 0;');
          } else if (attributes.align === 'right') {
            styles.push('float: right; margin: 0 0 0.5rem 1rem;');
          }
          if (styles.length) {
            rules.style = styles.join(' ');
          }
          if (attributes.align) {
            (rules as any)['data-align'] = attributes.align;
          }
          if (attributes.fullWidth) {
            (rules as any)['data-full-width'] = 'true';
          }
          return rules;
        },
      },
    } as any;
  },
  addCommands() {
    return {
      setImageAlign:
        (align: 'left' | 'center' | 'right' | null) => ({ chain }: { chain: any }) => {
          return chain().updateAttributes(this.name, { align }).run();
        },
    } as any;
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

export default ResizableImage;
