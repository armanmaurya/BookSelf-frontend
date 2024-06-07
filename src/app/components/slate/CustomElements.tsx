import { RenderElementProps } from "slate-react";

export const H1Element = (props: RenderElementProps) => {
  return (
    <h1 className="text-4xl font-bold" style={{fontWeight:"bold"}} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const H2Element = (props: RenderElementProps) => {
  return (
    <h2 className="text-3xl" style={{fontWeight:"bold"}} {...props.attributes}>
      {props.children}
    </h2>
  );
};

export const H3Element = (props: RenderElementProps) => {
  return (
    <h3 className="text-2xl font-bold" {...props.attributes}>
      {props.children}
    </h3>
  );
};

export const H4Element = (props: RenderElementProps) => {
  return (
    <h4 className="text-xl font-bold" {...props.attributes}>
      {props.children}
    </h4>
  );
};

export const H5Element = (props: RenderElementProps) => {
  return (
    <h5 className="text-lg font-bold" {...props.attributes}>
      {props.children}
    </h5>
  );
};

export const H6Element = (props: RenderElementProps) => {
  return (
    <h6 className="text-base font-bold" {...props.attributes}>
      {props.children}
    </h6>
  );
};

export const DefaultElement = (props: RenderElementProps) => {
  return (
    <p className="my-2" {...props.attributes}>
      {props.children}
    </p>
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
