import { RenderElementProps } from "slate-react";
import { NodeType } from "../types";
import React from "react";

export const H1 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };

  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h1
      className="text-4xl font-bold"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h1>
  );
};

export const H2 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };
  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h2
      className="text-3xl font-bold"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h2>
  );
};

export const H3 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };
  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h3
      className="text-2xl font-bold"
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </h3>
  );
};

export const H4 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };
  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h4
      className="text-xl font-bold"
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </h4>
  );
};

export const H5 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };
  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h5
      className="text-lg font-bold"
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </h5>
  );
};

export const H6 = (props: RenderElementProps) => {
  const style = {
    textAlign: (props.element as any).align || "left",
  };
  const idAttribute = (props.element as any).id ? { id: (props.element as any).id } : {};
  return (
    <h6
      className="text-base font-bold"
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </h6>
  );
};
