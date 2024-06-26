import { NodeType } from "@/app/utils";
import { Transforms } from "slate";
import {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  useSlateStatic,
} from "slate-react";

export const H1Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H1 ? props.element.align : "left",
  };
  return (
    <h1 className="text-4xl font-bold" style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const H2Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H2 ? props.element.align : "left",
  };
  return (
    <h2 className="text-3xl" style={style} {...props.attributes}>
      {props.children}
    </h2>
  );
};

export const H3Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H3 ? props.element.align : "left",
  };
  return (
    <h3 className="text-2xl font-bold" {...props.attributes} style={style}>
      {props.children}
    </h3>
  );
};

export const H4Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H4 ? props.element.align : "left",
  };
  return (
    <h4 className="text-xl font-bold" {...props.attributes} style={style}>
      {props.children}
    </h4>
  );
};

export const H5Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H5 ? props.element.align : "left",
  };
  return (
    <h5 className="text-lg font-bold" {...props.attributes} style={style}>
      {props.children}
    </h5>
  );
};

export const H6Element = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H6 ? props.element.align : "left",
  };
  return (
    <h6 className="text-base font-bold" {...props.attributes} style={style}>
      {props.children}
    </h6>
  );
};

export const DefaultElement = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.PARAGRAPH ? props.element.align : "left",
  };
  return (
    <div className={`my-2`} style={style} {...props.attributes}>
      {props.children}
    </div>
  );
};

export const OrderedListElement = (props: RenderElementProps) => {
  return (
    <ol {...props.attributes} className="font-sans list-decimal ml-4">
      {props.children}
    </ol>
  );
};

export const UnorderedListElement = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc ml-4">
      {props.children}
    </ul>
  );
};

export const ListItemElement = (props: RenderElementProps) => {
  return <li {...props.attributes}>{props.children}</li>;
};

export const ImageElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  let imgUrl = "";
  if (element.type === "image") {
    imgUrl = element.url as string;
  }
  console.log("Runnded");
  return (
    <div {...attributes}>
      {imgUrl === "" ? (
        <div
          contentEditable={false}
          className="w-full h-12 bg-slate-200 flex items-center p-3"
        >
          <img
            src="https://img.icons8.com/?size=100&id=53386&format=png&color=000000"
            className="h-10"
            alt=""
          />
        </div>
      ) : (
        <div>
          <div contentEditable={false}>
            <img
              src={element.type === "image" ? (element.url as string) : ""}
              alt="Invalid Image URL"
              className={`w-full rounded-lg`}
            />
          </div>
          <div className="w-full text-center text-sm">{children}</div>
        </div>
      )}
    </div>
  );
};

export const CodeElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  return (
    <pre className="bg-slate-100 p-4 rounded my-2 overflow-auto" {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

export const Leaf = (props: RenderLeafProps) => {
  const { text, ...rest } = props.leaf;
  return (
    <span
      {...props.attributes}
      className={`${props.leaf.bold ? " font-bold " : ""}${
        props.leaf.italic ? " `italic " : ""
      }${props.leaf.underline ? " underline " : ""}${
        props.leaf.code ? " bg-slate-200 px-0.5 rounded " : ""
      }${Object.keys(rest).join(" ")}`}
    >
      {props.children}
    </span>
  );
};
