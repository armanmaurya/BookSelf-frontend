import { Article } from "./types";

interface CustomResponse {
  data: Article;
  is_owner: boolean;
}

export async function getData(
  id: string,
  headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: "",
  }
): Promise<CustomResponse| null> {
  try {
    const res = await fetch(`${API_ENDPOINT.article.url}?slug=${id}`, {
      method: "GET",
      headers: headers,
    });
    if (res.ok) {
      return await res.json();
    }
    console.log(await res.body);
    
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

const apiURl = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINT = {
  notebook: {
    url: `${apiURl}/notebook`,
    method: "GET",
  },
  login: {
    url: `${apiURl}/account/login/`,
    method: "POST",
  },
  search: {
    url: `${apiURl}/api/search/`,
    method: "GET",
  },
  register: {
    url: `${apiURl}/account/register/`,
    method: "POST",
  },
  logout: {
    url: `${apiURl}/account/logout/`,
    method: "GET",
  },
  googleAuth: {
    url: `${apiURl}/account/`,
    method: "GET",
  },
  sendcode: {
    url: `${apiURl}/account/sendcode/`,
    method: "POST",
  },
  verifycode: {
    url: `${apiURl}/account/verifycode/`,
    method: "POST",
  },
  article: {
    url: `${apiURl}/article/`,
    methods: ["GET", "POST"],
  },
  articleCheckOwner: {
    url: `${apiURl}/article/checkowner/`,
    methods: ["GET"],
  },
  articleUpload: {
    url: `${apiURl}/article/upload/`,
    method: "POST",
  },
  newNotebook: {
    url: `${apiURl}/notebooks`,
    method: "POST",
  }
};

export const getGoogleAuthUrl = (redirect_path: string) => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const redirect_url = `${process.env.NEXT_PUBLIC_GOGGLE_REDIRECT_URL_ENDPOINT}${redirect_path}`;
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id as string,
    redirect_uri: redirect_url,
    prompt: "select_account",
    access_type: "offline",
    scope,
  });

  return `${googleAuthUrl}?${params}`;
};

export const checklogin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/example/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      // window.location.href = "/";
      return true;
    }
  } catch (error) {
    console.log("Network error");
  }

  return false;
};

export interface CustomNodeTypes {
  PARAGRAPH: string;
  H1: string;
  H2: string;
  H3: string;
  H4: string;
  H5: string;
  H6: string;
  CODE: string;
}

export class SlateToMarkdown {
  nodeTypes: CustomNodeTypes;

  constructor(nodeTypes: CustomNodeTypes) {
    this.nodeTypes = nodeTypes;
  }

  convert = (nodes: any) => {
    const startTime = performance.now();
    let markdown = "";
    nodes.forEach((node: any) => {
      switch (node.type) {
        case this.nodeTypes.PARAGRAPH:
          for (const child of node.children) {
            if (child.bold && child.italic) {
              markdown += "***" + child.text + "***";
            } else if (child.bold) {
              markdown += "**" + child.text + "**";
            } else if (child.italic) {
              markdown += "*" + child.text + "*";
            } else {
              markdown += child.text;
            }
          }
          markdown += "\n";
          break;
        case this.nodeTypes.H1:
          markdown += "# " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H2:
          markdown += "## " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H3:
          markdown += "### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H4:
          markdown += "#### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H5:
          markdown += "##### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.H6:
          markdown += "###### " + node.children[0].text + "\n";
          break;
        case this.nodeTypes.CODE:
          markdown += "```\n";
          for (const child of node.children) {
            markdown += child.text;
          }
          markdown += "\n```\n";
          break;
      }
    });
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log("Time taken:", timeTaken, "ms");
    return markdown;
  };
}

export const markdownTokenizer = (textin: string) => {
  let text = textin;
  const tokens: any[] = [];

  // bold and italic (?<!\*)\*\*\* ?(?!\*\*\*)[^*]+ ?\*\*\*(?!\*)
  const patterns = [
    {
      regex: /(?<!\*)\* ?(?!\*)[^*]+ ?\*(?!\*)/g,
      type: "italic",
    },
    {
      regex: /(?<!\*)\*\* ?(?!\*\*)[^*]+ ?\*\*(?!\*)/g,
      type: "bold",
    },
    {
      regex: /(?<!\*)\*\*\* ?(?!\*\*\*)[^*]+ ?\*\*\*(?!\*)/g,
      type: "bold_italic",
    },
    {
      regex: /(?<!~)~ ?[^~]+ ?~(?!~)/g,
      type: "strike",
    },
  ];
  // boldItalicMatchedIndex = {

  // }
  if (text.startsWith("#")) {
    if (text.startsWith("# ")) {
      tokens.push({
        type: "h1",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("## ")) {
      tokens.push({
        type: "h2",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("### ")) {
      tokens.push({
        type: "h3",
        content: text,
      });
      return tokens;
    }

    if (text.startsWith("#### ")) {
      tokens.push({
        type: "h4",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("##### ")) {
      tokens.push({
        type: "h5",
        content: text,
      });
      return tokens;
    }
    if (text.startsWith("###### ")) {
      tokens.push({
        type: "h6",
        content: text,
      });
      return tokens;
    }
  }

  let decorationList: any[] = [];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      // console.log(match);

      decorationList.push({
        index: match.index,
        type: pattern.type,
        content: match[0],
      });
    }
  });

  decorationList = decorationList.sort((a, b) => a.index - b.index);
  console.log(decorationList);

  for (let i = 0; i < decorationList.length; i++) {
    if (i === 0) {
      tokens.push(text.slice(0, decorationList[i].index));
    } else {
      tokens.push(
        text.slice(
          decorationList[i - 1].index + decorationList[i - 1].content.length,
          decorationList[i].index
        )
      );
    }
    tokens.push({
      type: decorationList[i].type,
      content: decorationList[i].content,
    });
    // text = text.slice(decorationList[i].index + decorationList[i].content.length);
  }

  return tokens;
};
