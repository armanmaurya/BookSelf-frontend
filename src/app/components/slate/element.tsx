import { NodeType } from "@/app/utils";
import { RenderElementProps, RenderLeafProps } from "slate-react";

export const H1Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H1 ? props.element.align : "left"}
  return (
    <h1
      className="text-4xl font-bold"
      style={style}
      {...props.attributes}
    >
      {props.children}
    </h1>
  );
};

export const H2Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H2 ? props.element.align : "left"}
  return (
    <h2
      className="text-3xl"
      style={style}
      {...props.attributes}
    >
      {props.children}
    </h2>
  );
};

export const H3Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H3 ? props.element.align : "left"}
  return (
    <h3 className="text-2xl font-bold" {...props.attributes} style={style}>
      {props.children}
    </h3>
  );
};

export const H4Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H4 ? props.element.align : "left"}
  return (
    <h4 className="text-xl font-bold" {...props.attributes} style={style}>
      {props.children}
    </h4>
  );
};

export const H5Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H5 ? props.element.align : "left"}
  return (
    <h5 className="text-lg font-bold" {...props.attributes} style={style}>
      {props.children}
    </h5>
  );
};

export const H6Element = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.H6 ? props.element.align : "left"}
  return (
    <h6 className="text-base font-bold" {...props.attributes} style={style}>
      {props.children}
    </h6>
  );
};

export const DefaultElement = (props: RenderElementProps) => {
  const style = { textAlign: props.element.type === NodeType.PARAGRAPH ? props.element.align : "left"}
  return (
    <p className={`my-2 hover:bg-slate-50`} style={style} {...props.attributes}>
      {props.children}
    </p>
  );
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
  // const codeText = element.children.map((child: any) => child.text).join("\n");
  // const tokens = Prism.tokenize(codeText, Prism.languages.javascript);

  // const highlightedCode = tokens.map((token, i) => {
  //   if (typeof token === "string") {
  //     return <span key={i}>{token}</span>;
  //   } else {
  //     return (
  //       <span key={i} className={`token ${token.type}`}>
  //         {token.content}
  //       </span>
  //     );
  //   }
  // });

  return (
    <pre className="bg-zinc-900 text-white p-4 rounded" {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

export const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      className={` ${props.leaf.bold ? "font-bold" : ""} ${props.leaf.italic ? "italic" : ""} ${props.leaf.underline ? "underline" : ""} ${props.leaf.code ? "code" : ""} `}
    >
      {props.children}
    </span>
  );
};
