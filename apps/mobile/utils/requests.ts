import { CustomResponse } from "@repo/types";
import { API_ENDPOINT } from "./ApiEndpoints";

export async function getData(
  id: string,
  headers = {
    "Content-Type": "application/json",
  }
): Promise<CustomResponse | null> {
  const res = await fetch(`${API_ENDPOINT.article.url}?slug=${id}`, {
    method: "GET",
    headers: headers,
  });
  if (res.ok) {
    return await res.json();
  }
  return null;
}
