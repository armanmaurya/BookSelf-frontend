"use client";
import { RenderElementProps } from "slate-react";
import React from "react";
import { HeadingType } from "./../types/type";
import { HeadingElementType } from "./../types/element";
import {
  BaseHeading1,
  BaseHeading2,
  BaseHeading3,
  BaseHeading4,
  BaseHeading5,
  BaseHeading6,
} from "./base-heading";
import { CopyLink } from "./copy-link";

export const RenderHeading1 = (props: RenderElementProps) => {
  return (
    <BaseHeading1 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading1>
  );
};

export const RenderHeading2 = (props: RenderElementProps) => {
  return (
    <BaseHeading2 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading2>
  );
};

export const RenderHeading3 = (props: RenderElementProps) => {
  return (
    <BaseHeading3 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading3>
  );
};

export const RenderHeading4 = (props: RenderElementProps) => {
  return (
    <BaseHeading4 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading4>
  );
};

export const RenderHeading5 = (props: RenderElementProps) => {
  return (
    <BaseHeading5 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading5>
  );
};

export const RenderHeading6 = (props: RenderElementProps) => {
  return (
    <BaseHeading6 {...props}>
      <span>{props.children}</span>
      {(props.element as HeadingElementType).headingId && (
        <CopyLink headingId={(props.element as HeadingElementType).headingId} />
      )}
    </BaseHeading6>
  );
};
