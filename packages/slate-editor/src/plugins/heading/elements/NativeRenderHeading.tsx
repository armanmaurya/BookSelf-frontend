import { RenderElementProps } from "slate-react";
import { NodeType } from "../../../types";
import React from "react";
import { Text, StyleProp, TextStyle, } from "react-native";

export const H1 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H1 ? props.element.align : "left",
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "bold",
    
  };


  const idAttribute =
    props.element.type === NodeType.H1
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text style={style} selectable {...props.attributes} {...idAttribute}>
      {props.children}
    </Text>
  );
};

export const H2 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H2 ? props.element.align : "left",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "bold",
  };
  const idAttribute =
    props.element.type === NodeType.H2
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text style={style} {...props.attributes} {...idAttribute}>
      {props.children}
    </Text>
  );
};

export const H3 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H3 ? props.element.align : "left",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
  };
  const idAttribute =
    props.element.type === NodeType.H3
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text
      {...props.attributes}
      style={style}
      selectable
      {...idAttribute}
    >
      {props.children}
    </Text>
  );
};

export const H4 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H4 ? props.element.align : "left",
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "bold",
  };
  const idAttribute =
    props.element.type === NodeType.H4
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </Text>
  );
};

export const H5 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H5 ? props.element.align : "left",
      fontSize: 18,
      lineHeight: 28,
      fontWeight: "bold",
  };
  const idAttribute =
    props.element.type === NodeType.H5
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text
      {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </Text>
  );
};

export const H6 = (props: RenderElementProps) => {
  const style: StyleProp<TextStyle> = {
    textAlign:
      props.element.type === NodeType.H6 ? props.element.align : "left",
      fontSize: 16,
      fontWeight: "bold",
  };
  const idAttribute =
    props.element.type === NodeType.H6
      ? props.element.id
        ? { id: props.element.id }
        : {}
      : {};
  return (
    <Text

    {...props.attributes}
      style={style}
      {...idAttribute}
    >
      {props.children}
    </Text>
  );
};
