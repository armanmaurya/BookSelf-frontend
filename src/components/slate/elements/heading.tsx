import { RenderElementProps } from "slate-react";
import { NodeType } from "@/components/slate/types";

export const H1 = (props: RenderElementProps) => {
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

export const H2 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      props.element.type === NodeType.H1 ? props.element.align : "left",
  };
  return (
    <h1 className="text-3xl font-bold" style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const H3 = (props: RenderElementProps) => {
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

export const H4 = (props: RenderElementProps) => {
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

export const H5 = (props: RenderElementProps) => {
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

export const H6 = (props: RenderElementProps) => {
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