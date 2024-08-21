import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Linking } from "react-native";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

// Function to generate dynamic content

export default function App() {
  const { slug } = useLocalSearchParams();
  const [webViewHeight, setWebViewHeight] = useState(0);
  // Source for WebView
  const onMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(parseInt(event.nativeEvent.data));
  };

  const url = "http://192.168.1.8:3000/webview/hiutle-article-12";
  const webviewRef = useRef<WebView | null>(null);
  const handleNavigationStateChange = (event: WebViewNavigation) => {
    // console.log(event.url, url);
    if (event.url !== url) {
      if (webviewRef.current) {
        webviewRef.current.stopLoading();
      }
      Linking.openURL(event.url);
    }
  };
  const handleShouldStartLoadWithRequest = (request: any) => {
    // console.log(request.url, url);
    if (request.url !== url) {
      Linking.openURL(request.url);
      return false;
    }
    return true;
  };

  const injectedJavaScript = `
    (function() {
      function updateHeight() {
        const height = document.documentElement.scrollHeight;
        window.ReactNativeWebView.postMessage(height.toString());
      }
      updateHeight();
      window.addEventListener('load', updateHeight);
      window.addEventListener('resize', updateHeight);
    })();
    true;
  `;

  return (
    <ScrollView
      overScrollMode="always"
      // contentContainerStyle={{ flexGrow: 1 }}
    >
      <View>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
        <Text style={{ fontSize: 20, textAlign: "center" }}>Hello World!</Text>
      </View>
      <WebView
        ref={webviewRef}
        overScrollMode="never"
        style={{ height: webViewHeight }}
        scrollEnabled={false}
        source={{ uri: url }}
        onMessage={onMessage}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onLoadEnd={() =>
          webviewRef.current?.injectJavaScript(injectedJavaScript)
        }
      />
    </ScrollView>
  );
}
