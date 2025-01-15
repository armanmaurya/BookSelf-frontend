import Link from "next/link";

export const FloatingButton = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <>
      <Link
        href={href}
        className="hover:cursor-pointer w-12 shadow-md bg-sky-500 h-8 bottom-4 fixed right-2 border flex items-center justify-center rounded mt-2"
      >
        {children}
      </Link>
    </>
  );
};
