import { Metadata } from "next";
import { NotebooksView } from "./NotebooksView";

export const metadata: Metadata = {
  title: "Notebooks | BookSelf",
  description: "Discover and explore notebooks from the BookSelf community",
};

export default function NotebooksPage() {
  return <NotebooksView />;
}