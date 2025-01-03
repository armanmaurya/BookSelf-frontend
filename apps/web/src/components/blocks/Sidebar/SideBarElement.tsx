import Link from "next/link";

interface SideBarElementProps {
  href: string;
  children: React.ReactNode;
}

export const SideBarElement = ({ href, children }: SideBarElementProps) => {
  return (
    <li className="p-2 rounded-lg text-center hover:bg-blue-400 hover:bg-opacity-15 text-sm sidebar-element">
      <Link href={href} className="flex ">
        {children}
      </Link>
    </li>
  );
};