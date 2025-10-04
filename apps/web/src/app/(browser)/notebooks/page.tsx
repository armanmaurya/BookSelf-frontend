import { Metadata } from "next";
import { NotebooksView } from "./NotebooksView";

export const metadata: Metadata = {
  title: "Notebooks | InfoBite",
  description: "Discover and explore notebooks from the InfoBite community",
};

export default function NotebooksPage() {
  return <NotebooksView />;
}