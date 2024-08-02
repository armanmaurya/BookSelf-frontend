import React, { useEffect, useState } from "react";
import { useWindowDimensions, View, Text, ScrollView } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import ReactDOMServer from "react-dom/server";
import { Descendant } from "slate";
import { NodeType } from "@repo/slate-editor/src/types";
import { RenderEditorStatic } from "@repo/slate-editor";
import { inlinePadding } from "../components/styles/padding";
import { inlineMargin } from "../components/styles/margin";
import { inlineBorder } from "../components/styles/border";
import { API_ENDPOINT } from "../utils/ApiEndpoints";
import { getData } from "../utils";
import { useLocalSearchParams } from "expo-router";

const generateContent = async (slug: string) => {
  const initialValue2: Descendant[] = [
    {
      id: "heading-one",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      id: "heading-one",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      id: "heading-one",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      id: "heading-one",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      id: "heading-one",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      type: NodeType.UNORDERED_LIST,
      children: [
        {
          type: NodeType.LIST_ITEM,
          children: [
            {
              text: "List Item 1",
            },
          ],
        },
        {
          type: NodeType.LIST_ITEM,
          children: [
            {
              text: "List Item 2",
            },
          ],
        },
        {
          type: NodeType.ORDERED_LIST,
          children: [
            {
              type: NodeType.LIST_ITEM,
              children: [
                {
                  text: "List Item 1",
                },
              ],
            },
            {
              type: NodeType.LIST_ITEM,
              children: [
                {
                  text: "List Item 2",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: NodeType.ORDERED_LIST,
      children: [
        {
          type: NodeType.LIST_ITEM,
          children: [
            {
              text: "List Item 1",
            },
          ],
        },
        {
          type: NodeType.LIST_ITEM,
          children: [
            {
              text: "List Item 2",
            },
          ],
        },
        {
          type: NodeType.ORDERED_LIST,
          children: [
            {
              type: NodeType.LIST_ITEM,
              children: [
                {
                  text: "List Item 1",
                },
              ],
            },
            {
              type: NodeType.LIST_ITEM,
              children: [
                {
                  text: "List Item 2",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "heading-on-1e",
      type: NodeType.H1,
      align: "center",
      children: [
        {
          text: "Heading One",
        },
      ],
    },
    {
      type: NodeType.UNORDERED_LIST,
      children: [
        {
          type: NodeType.LIST_ITEM,
          children: [{ text: "List Item 1" }],
        },
      ],
    },
    {
      type: NodeType.PARAGRAPH,
      align: "left",
      children: [
        {
          text: "Heading Two",
        },
      ],
    },
    {
      type: NodeType.PARAGRAPH,
      align: "center",
      children: [
        {
          text: "A line of text in a paragraph.",
          bold: true,
          underline: true,
        },
        {
          text: "Bold",
          bold: true,
          italic: true,
        },
        {
          text: " Some More Text ",
        },
        {
          text: "Italic",
          italic: true,
        },
        {
          text: " Some more text ",
        },
        {
          text: "Underlined",
          underline: true,
        },
        {
          text: " Some more text ",
        },
        {
          text: "Bold Italic",
          bold: true,
          italic: true,
        },
      ],
    },
    {
      type: NodeType.CODE,
      language: "javascript",
      children: [
        {
          text: "const a = 5;",
        },
        {
          text: "const b = 10;",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.BLOCKQUOTE,
      children: [
        {
          text: "A line of text in a blockquote.",
        },
      ],
    },
    {
      type: NodeType.PARAGRAPH,
      align: "right",
      children: [
        {
          text: "A line of text \nin a paragraph.",
          // bold: true,
        },
        {
          text: "Bold",
          bold: true,
        },
        {
          text: " Some More Text ",
        },
        {
          text: "Italic",
          italic: true,
        },
        {
          text: " Some more text ",
        },
        {
          text: "Underlined",
          underline: true,
        },
        {
          text: " Some more text ",
        },
        {
          text: "Bold Italic",
          bold: true,
          italic: true,
        },
      ],
    },

    // {
    //   type: "code",
    //   language: "javascript",
    //   children: [
    //     {
    //       text: "const a = 5;",
    //     },
    //     {
    //       text: "const b = 10;",
    //     },
    //   ],
    // },
  ];

  const data = await getData(slug);
  if (data) {
    const content = data.data.content;
    const jsonContent: Descendant[] = JSON.parse(content) || [];
    return (
      <div id="content">
        <RenderEditorStatic value={jsonContent} />
      </div>
    );
  }
};

// Function to generate dynamic content

export default function App() {
  const { slug } = useLocalSearchParams();
  const [webViewHeight, setWebViewHeight] = useState(0);
  // Source for WebView
  const onMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(parseInt(event.nativeEvent.data));
  };
  const [htmlContent, setHtmlContent] = useState("");


  useEffect(() => {
    generateContent(slug as string).then((content) => {
      const htmlContent = ReactDOMServer.renderToStaticMarkup(content);
      setHtmlContent(htmlContent);
    });
  }
  , [slug]);

  

  const source = {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <style>
            .bg-slate-100 {
                background-color: rgb(241 245 249 / 1) /* #f1f5f9 */;
            }
            .underline {
                text-decoration-line: underline;
            }
            .italic {
                font-style: italic;
            }
            .font-bold {
                font-weight: bold;
            }
            .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #93a1a1; /* base1 */
  }
  
  .token.punctuation {
    color: #586e75; /* base01 */
  }
  
  .token.namespace {
    opacity: .7;
  }
  
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #268bd2; /* blue */
  }
  
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.url,
  .token.inserted {
    color: #2aa198; /* cyan */
  }
  
  .token.entity {
    color: #657b83; /* base00 */
    background: #eee8d5; /* base2 */
  }
  
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #859900; /* green */
  }
  
  .token.function,
  .token.class-name {
    color: #b58900; /* yellow */
  }
  
  .token.regex,
  .token.important,
  .token.variable {
    color: #cb4b16; /* orange */
  }
  
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }
  
  .token.entity {
    cursor: help;
  }
            ${inlinePadding}
            ${inlineMargin}
            ${inlineBorder}
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
              function updateHeight() {
                const height = document.getElementById('content').offsetHeight;
                window.ReactNativeWebView.postMessage(height);
              }
              window.onload = updateHeight;
              window.onresize = updateHeight;
            </script>
        </body>
      </html>
    `,
  };
  return (
    <ScrollView overScrollMode="always" contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
      </View>
      <WebView
        overScrollMode="never"
        style={{ height: webViewHeight }}
        scrollEnabled={false}
        source={source}
        onMessage={onMessage}
      />
    </ScrollView>
  );
}

// const WebCompoenent = () => {
//   return (

//   );
// };
