export enum NodeType {
  PARAGRAPH = "paragraph",
  H1 = "heading-one",
  H2 = "heading-two",
  H3 = "heading-three",
  H4 = "heading-four",
  H5 = "heading-five",
  H6 = "heading-six",
  CODE = "code",
}

const apiURl = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINT = {
  login: {
    url: `${apiURl}/account/login/`,
    method: "POST",
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


