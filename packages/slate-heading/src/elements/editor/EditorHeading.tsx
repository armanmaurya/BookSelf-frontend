"use client";
import { RenderElementProps } from "slate-react";
import React from "react";
import { HeadingType } from "../../types/type";
import { HeadingElementType } from "../../types/element";
import {
  BaseHeading1,
  BaseHeading2,
  BaseHeading3,
  BaseHeading4,
  BaseHeading5,
  BaseHeading6,
} from "../base-heading";

export const EditorHeading1 = (props: RenderElementProps) => {
  return (
    <BaseHeading1 {...props} />
  );
};

export const EditorHeading2 = (props: RenderElementProps) => {
  return <BaseHeading2 {...props} />;
};

export const EditorHeading3 = (props: RenderElementProps) => {
  return <BaseHeading3 {...props} />;
};

export const EditorHeading4 = (props: RenderElementProps) => {
  return <BaseHeading4 {...props} />;
};

export const EditorHeading5 = (props: RenderElementProps) => {
  return <BaseHeading5 {...props} />;
};

export const EditorHeading6 = (props: RenderElementProps) => {
  return <BaseHeading6 {...props} />;
};
