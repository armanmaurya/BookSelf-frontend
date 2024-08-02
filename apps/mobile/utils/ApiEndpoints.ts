import { CustomResponse } from "../types";

const apiURl = process.env.EXPO_PUBLIC_API_URL;

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


