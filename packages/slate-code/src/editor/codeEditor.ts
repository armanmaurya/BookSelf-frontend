import {
  Path,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
} from "slate";

export const CodeEditor = {
  insertCode(editor: SlateEditor, type: string, initialText?: string) {
    if (!editor.selection) {
      return;
    }

    let nodes = SlateEditor.nodes(editor, {
      at: editor.selection,
      match: (n) => SlateElement.isElement(n),
      mode: "lowest",
    });

    // for (const node of nodes) {
    //   if (node[0].type !== type) {
    //     console.log("Not a given block");
    //     return;
    //   }
    //   //   console.log(editor.selection);
    // }

    const edges = Range.edges(editor.selection);

    Transforms.splitNodes(editor, {
      at: edges[1],
      match: (n) => SlateElement.isElement(n),
    });
    Transforms.splitNodes(editor, {
      at: edges[0],
      match: (n) => SlateElement.isElement(n),
    });

    let text = getText(editor);
    if (initialText != null) {
      text = initialText;
    }

    Transforms.removeNodes(editor, {
      at: editor.selection,
    });

    console.log("text", text);
    Transforms.insertNodes(editor, {
      type: "code",
      children: [
        {
          text: text ? text : "",
          type: "code",
        },
      ],
      language: "",
    });

    // const text = SlateEditor.string(editor, editor.selection);

    // console.log("text", text);
  },
  isBlockActive(editor: SlateEditor) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "code",
    });

    return !!match;
  },
  text(editor: SlateEditor) {
    return getText(editor);
  }
};

const getText = (editor: SlateEditor) => {
  if (editor.selection) {
    let text = "";
    const nodes = SlateEditor.nodes(editor, {
      at: editor.selection,
      match: (n) => SlateElement.isElement(n),
      mode: "lowest",
    });

    for (const node of nodes) {
      console.log(Path.parent(Range.edges(editor.selection)[1].path), node[1]);
      if (
        !(
          Path.equals(
            Path.parent(Range.edges(editor.selection)[1].path),
            node[1]
          ) && Range.edges(editor.selection)[1].offset === 0
        )
      ) {
        // console.log("Here");
        text += SlateEditor.string(editor, node[1]);
        text += "\n";
      }
    }

    return text;
  }
};
