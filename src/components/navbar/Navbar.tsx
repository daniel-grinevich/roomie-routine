import Link from "next/link";
import Image from "next/image"; // Don't forget to import Image
import Links from "./links/Links";


export default function Navbar() {
    return (
      <nav className="flex items-center h-[80px] flex-row gap-4 py-4">
        <div id="logo" className="">
            <h1>Roomie Routine</h1>
        </div>
        <div>
            <Links/>
        </div>
      </nav>
    );
  }