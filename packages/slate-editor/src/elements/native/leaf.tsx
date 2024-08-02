import { RenderLeafProps } from "slate-react";
import { Text } from "react-native";
import React from "react";

export const Leaf = (props: RenderLeafProps) => {
  const { text, ...rest } = props.leaf;
  return (
    <Text
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecorationLine: props.leaf.underline ? "underline" : "none",
      }}
    >
      {props.children}
    </Text>
  );
};
