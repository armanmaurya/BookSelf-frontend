import { RenderElementProps } from "slate-react";
import { HeadingElementType } from "../types/element";
import { HeadingType } from "../types/type";

// Add type for props
export const BaseHeading1 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H1
        ? (props.element as HeadingElementType).align
        : "left",
  };

  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H1
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h1
      className="text-4xl font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h1>
  );
};

export const BaseHeading2 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H2
        ? (props.element as HeadingElementType).align
        : "left",
  };
  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H1
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h2
      className="text-3xl font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h2>
  );
};

export const BaseHeading3 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H3
        ? (props.element as HeadingElementType).align
        : "left",
  };
  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H3
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h3
      className="text-2xl font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h3>
  );
};

export const BaseHeading4 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H4
        ? (props.element as HeadingElementType).align
        : "left",
  };
  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H4
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h4
      className="text-xl font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h4>
  );
};

export const BaseHeading5 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H5
        ? (props.element as HeadingElementType).align
        : "left",
  };
  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H5
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h5
      className="text-lg font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h5>
  );
};

export const BaseHeading6 = (props: RenderElementProps) => {
  const style = {
    textAlign:
      (props.element as HeadingElementType).type === HeadingType.H6
        ? (props.element as HeadingElementType).align
        : "left",
  };
  const idAttribute =
    (props.element as HeadingElementType).type === HeadingType.H6
      ? (props.element as HeadingElementType).headingId
        ? { id: (props.element as HeadingElementType).headingId }
        : {}
      : {};
  return (
    <h6
      className="text-base font-bold group"
      style={style}
      {...props.attributes}
      {...idAttribute}
    >
      {props.children}
    </h6>
  );
};
