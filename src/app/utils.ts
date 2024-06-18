export enum NodeType {
  PARAGRAPH = "paragraph",
  H1 = "heading-one",
  H2 = "heading-two",
  H3 = "heading-three",
  H4 = "heading-four",
  H5 = "heading-five",
  H6 = "heading-six",
  CODE = "code",
  ORDERED_LIST = "ordered-list",
  UNORDERED_LIST = "unordered-list",
  LIST_ITEM = "list-item",
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

interface CustomResponse {
  data: Article;
  is_owner : boolean;
}

export async function getData(
  id: string,
  headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cookie": "",
  }
): Promise<CustomResponse> {
  try {
    const res = await fetch(`${API_ENDPOINT.article.url}?id=${id}`, {
      method: "GET",
      headers: headers,
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

const apiURl = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINT = {
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
    url: `${apiURl}/account/google-auth/`,
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


