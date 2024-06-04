import Markdown, { Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
// import remarkPrism from "remark-prism";
// import remarkHighlightjs from "remark-highlight.js";
// import "highlight.js/styles/a11y-light.css";

import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

const components: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-4xl font-bold text-black" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-3xl font-semibold text-black" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-2xl font-semibold text-black" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-xl font-semibold text-black" {...props} />
  ),
  h5: ({ node, ...props }) => (
    <h5 className="text-lg font-semibold text-black" {...props} />
  ),
  h6: ({ node, ...props }) => (
    <h6 className="text-base font-semibold text-black" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-base py-1" {...props}>
      {props.children}
    </p>
  ),

  code: ({ node, ...props }) => (
    <code
      style={{ borderRadius: "0.5rem", backgroundColor: "#e0e0e0"}}
      className=""
      {...props}
    />
  ),
  pre: ({ node, ...props }) => <pre className="my-1" {...props} />,
};

interface Article {
  id: number;
  title: string;
  content: string;
  author: number;
  created_at: string;
}

async function getData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/article?id=${id}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error here, e.g. show an error message to the user
    throw error; // Rethrow the error to propagate it to the caller
  }
}
const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const data: Promise<Article> = await getData(id);
  // console.log(data);
  const content = (await data).content;

  return (
    <div className="">
      <div className="flex items-center justify-center p-2">
        <h1 className="text-4xl font-semibold"><u>{(await data).title}</u></h1>
      </div>
      <Markdown
        className="p-4 pb-10"
        components={components}
        remarkPlugins={[remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default Page;
