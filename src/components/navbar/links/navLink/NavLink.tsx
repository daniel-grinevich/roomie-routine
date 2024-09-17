"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  item: {
    path: string;
    name: string;
  };
}

export default function NavLink({ item }: NavLinkProps) {
  const pathName = usePathname();

  console.log(pathName); // This will help you debug what pathName returns

  return (
    <Link 
      href={item.path} 
      className={pathName === item.path ? "text-blue-500 font-bold mx-4" : "text-white mx-4"}>
      {item.name}
    </Link>
  );
}