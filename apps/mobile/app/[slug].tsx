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
import { getData } from "../utils";
import { useLocalSearchParams } from "expo-router";
import { prismjsTheme } from "../components/styles/prismjs";

const generateContent = async (slug: string) => {

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
            .flex {
                display: flex;
            }
            .justify-start {
    justify-content: flex-start;
}
    .justify-center {
    justify-content: center;
}
    .justify-end {
    justify-content: flex-end;
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
            ${prismjsTheme}
            ${inlinePadding}
            ${inlineMargin}
            ${inlineBorder}
          </style>
        </head>
        <body>
          ${htmlContent}
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
          Text
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
