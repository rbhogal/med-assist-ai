import { Button } from "@/components/ui/button";
import { Activity, ClipboardPlus } from "lucide-react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky flex justify-between items-center py-3 px-6 backdrop-blur-md bg-white/80 border-b border-gray-300 bg-gradient-to-b from-white/80 to-gray-50 shadow-xs">
      <Link href={"/demo"} className="flex items-center space-x-2 ">
        {/* <Activity className="w-6 h-6 text-blue-600" /> */}
        <ClipboardPlus className="w-6 h-6 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-800">MedAssist</h1>
      </Link>

      <Link href="/login">
        <Button variant="default" className="cursor-pointer ">
          Login
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
