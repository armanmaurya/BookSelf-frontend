import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";
import { FaRegImage } from "react-icons/fa6";
import { Transforms } from "slate";
import { NodeType } from "../../../types";
import { Resizable } from "re-resizable";
import { AlignButton } from "../../../components/alignButton";
import {
  MenuItem,
  ThreeDotsMenu,
} from "../../../components/threeDotsMenu";
import { useState, useEffect } from "react";

export const EditableImage = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  let imgUrl = "";
  if (element.type === "image") {
    imgUrl = element.url as string;
  }
  const [isOpen, setIsOpen] = useState(false);

  const style = {
    textAlign:
      props.element.type === NodeType.IMAGE ? props.element.align : "left",
  };

  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  useEffect(() => {
    if (!selected) {
      setIsOpen(false);
    }
  }, [selected]);
  return (
    <div {...attributes} className="py-3">
      {children}
      {imgUrl === "" ? (
        <div className="relative flex justify-center" contentEditable={false}>
          <div
            contentEditable={false}
            className={`w-full h-12  flex items-center bg-opacity-15 rounded-md cursor-pointer p-3 ${
              selected ? "bg-blue-900" : "bg-neutral-700"
            }`}
          >
            <FaRegImage size={35} />
            <span className="px-2">Add Image</span>
          </div>
          {selected && (
            <div className="absolute justify-center top-10">
              <div className="rounded bg-neutral-600">
                <input
                  type="text"
                  className="bg-transparent p-2"
                  placeholder="Paste Image link..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const url = e.currentTarget.value;

                      Transforms.setNodes(editor, { url }, { at: path });
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div contentEditable={false}>
          <div
            className={`flex ${
              element.type === NodeType.IMAGE &&
              (element.align === "left"
                ? "justify-start"
                : element.align === "center"
                ? "justify-center"
                : element.align === "right"
                ? "justify-end"
                : "")
            }`}
          >
            <Resizable
              defaultSize={{
                width: element.type === NodeType.IMAGE ? element.width : 320,
                // height: 200,
              }}
              resizeRatio={2}
              lockAspectRatio={true}
              className="relative flex justify-center"
              onResizeStop={(e, direction, ref, d) => {
                Transforms.setNodes(
                  editor,
                  {
                    width: parseInt(ref.style.width, 10),
                  },
                  {
                    at: path,
                  }
                );
                // console.log(d.width)
              }}
              enable={{
                top: false,
                right: true,
                bottom: false,
                left: true,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }}
            >
              <img
                src={element.type === "image" ? (element.url as string) : ""}
                onError={(e) => {
                  Transforms.setNodes(editor, { url: "" }, { at: path });
                }}
                alt="Invalid Image URL"
                className={`rounded-lg w-full h-full  ${
                  selected && focused ? "border border-blue-500" : ""
                }`}
              />
              {selected && (
                <div className="absolute top-0 right-0 flex p-1">
                  <AlignButton
                    align={
                      element.type === NodeType.IMAGE ? element.align : "left"
                    }
                    onAlign={(align) => {
                      Transforms.setNodes(editor, { align }, { at: path });
                    }}
                  />
                  <ThreeDotsMenu>
                    <MenuItem
                      name="Replace"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    />
                  </ThreeDotsMenu>
                </div>
              )}
              {isOpen && selected && (
                <div className="absolute justify-center ">
                  <div className="rounded bg-neutral-600">
                    <input
                      type="text"
                      className="bg-transparent p-2"
                      placeholder="Paste Image link..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const url = e.currentTarget.value;
                          setIsOpen(false);
                          Transforms.setNodes(editor, { url }, { at: path });
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </Resizable>
          </div>
          {/* <div className="w-full text-center text-sm"></div> */}
        </div>
      )}
    </div>
  );
};
