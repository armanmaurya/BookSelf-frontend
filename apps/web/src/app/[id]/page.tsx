// "use client";
import { notFound } from "next/navigation";
import { getData } from "@/app/utils";
// import { NodeType } from "@/components/slate/types";
import { EditButton } from "@/components/element/button/EditButton";
import { cookies } from "next/headers";
import { Descendant } from "slate";
import { RenderEditorStatic } from "@repo/slate-editor/renderer";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const cookieStore = cookies();

  const data = await getData(id, {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: `${cookieStore.get("sessionid")?.name}=${
      cookieStore.get("sessionid")?.value
    }`,
  });
  if (!data) {
    return notFound();
  }

  const content = data.data.content;
  // console.log();
  // if (!content) return notFound();

  const jsonContent: Descendant[] = JSON.parse(content) || [];

  // const tableofcontent = constructTableOfContents(jsonContent);

  return (
    <div className="">
      {data.is_owner && <EditButton id={id} />}
      <div className="flex">
        <div className="px-4 flex-1 overflow-auto h-[calc(100vh-48px)]">
          <div className="flex items-center justify-center p-1">
            <h1 className="text-4xl font-semibold">
              <u>{data.data.title || "Untitled"}</u>
            </h1>
          </div>
          <RenderEditorStatic value={jsonContent} />
        </div>
        <div className="p-3 flex-col sm:flex hidden">
          {/* <RenderTableOfContents value={tableofcontent} /> */}
        </div>
      </div>
    </div>
  );
};

const headings: { [key: string]: number } = {
  "heading-one": 1,
  "heading-two": 2,
  "heading-three": 3,
  "heading-four": 4,
  "heading-five": 5,
  "heading-six": 6,
};

type TableOfContentType = {
  id: string;
  text: string;
  children: TableOfContentType[];
  headingNumber: number;
};

/*When you push an object to the stack, you are not creating a new copy of the object; 
you are merely storing a reference to the same object in memory. 
Thus, when you update the children property of an object in the stack, 
the same object in the tableOfContents is also updated because they are references to the same object. */
// const constructTableOfContents = (value: Descendant[]) => {
//   let tableOfContents: TableOfContentType[] = [];
//   let stack: any[] = [];

//   value.forEach((node, i) => {
//     if (
//       Element.isElement(node) &&
//       (node.type === NodeType.H1 ||
//         node.type === NodeType.H2 ||
//         node.type === NodeType.H3 ||
//         node.type === NodeType.H4 ||
//         node.type === NodeType.H5 ||
//         node.type === NodeType.H6)
//     ) {
//       // console.log(tableOfContents);

//       const headingNumber = headings[node.type as string];
//       const Item = {
//         id: `${node.id}`,
//         text: node.children[0].text,
//         children: [],
//         headingNumber: headingNumber,
//       };

//       while (
//         stack.length > 0 &&
//         stack[stack.length - 1].headingNumber >= headingNumber
//       ) {
//         stack.pop();
//       }

//       if (stack.length > 0) {
//         // If we update the value of the children property of the object in the stack, the same object in the tableOfContents is also updated because they are references to the same object.
//         stack[stack.length - 1].children.push(Item);
//       } else {
//         // H1 Item added to root
//         tableOfContents.push(Item);
//       }

//       // We also push the Item to the stack as if we update the value of the children property of the object in the stack, the same object in the tableOfContents is also updated because they are references to the same object.
//       stack.push(Item);
//       // console.log(JSON.stringify(stack, null, 2));
//     }
//   });

//   return tableOfContents;
// };

// // Rucussive function to render the table of contents
// const RenderTableOfContents = ({
//   value,
//   className,
// }: {
//   value: TableOfContentType[];
//   className?: string;
// }) => {
//   return (
//     <>
//       {value.map((node, i) => {
//         if (node.children.length > 0) {
//           return (
//             <div key={i} className={`${className}`}>
//               <a
//                 className="text-blue-400 hover:text-blue-500"
//                 href={`#${node.id}`}
//               >
//                 {node.text}
//               </a>
//               <RenderTableOfContents className="pl-4" value={node.children} />
//             </div>
//           );
//         } else {
//           return (
//             <div className={`${className}`} key={i}>
//               <a
//                 className="py-1 text-blue-400 hover:text-blue-500"
//                 href={`#${node.id}`}
//               >
//                 {node.text}
//               </a>
//             </div>
//           );
//         }
//       })}
//     </>
//   );
// };

export default Page;
