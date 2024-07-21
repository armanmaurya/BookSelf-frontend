import { NodeType } from "../../../types";
import { RenderElementProps } from "slate-react";

export const RenderImage = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  return (
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
      <img
        src={element.type === "image" ? (element.url as string) : ""}
        alt="Invalid Image URL"
        className={`rounded-lg`}
        width={element.type === NodeType.IMAGE ? element.width : 320}
      />
    </div>
  );
};
