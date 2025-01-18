import { RenderElementProps } from "slate-react";
import React from "react";
import { HeadingType } from "../../types/type";

export const EditorHeading1 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H1 ? props.element.align : "left",
    };

    const idAttribute =
        props.element.type === HeadingType.H1
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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

export const EditorHeading2 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H2 ? props.element.align : "left",
    };
    const idAttribute =
        props.element.type === HeadingType.H2
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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

export const EditorHeading3 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H3 ? props.element.align : "left",
    };
    const idAttribute =
        props.element.type === HeadingType.H3
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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

export const EditorHeading4 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H4 ? props.element.align : "left",
    };
    const idAttribute =
        props.element.type === HeadingType.H4
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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

export const EditorHeading5 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H5 ? props.element.align : "left",
    };
    const idAttribute =
        props.element.type === HeadingType.H5
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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

export const EditorHeading6 = (props: RenderElementProps) => {
    const style = {
        textAlign:
            props.element.type === HeadingType.H6 ? props.element.align : "left",
    };
    const idAttribute =
        props.element.type === HeadingType.H6
            ? props.element.id
                ? { id: props.element.id }
                : {}
            : {};
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
