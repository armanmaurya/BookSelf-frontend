import Link from "next/link";

export const PreviewButton = ({ id }: { id: string|null }) => {
  return (
    <>
      <Link
        href={`/${id}`}
        className="hover:cursor-pointer p-1 shadow-md bg-sky-500 h-8 bottom-4 fixed right-2 border flex items-center justify-center rounded mt-2"
      >
        Preview
      </Link>
    </>
  );
};
