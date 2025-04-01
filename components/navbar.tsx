import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 backdrop-blur-md bg-white/80 border-b border-gray-300 bg-gradient-to-b from-white/80 to-gray-50">
      <div className="flex items-center space-x-2">
        <Activity className="w-6 h-6 text-blue-600" />
        <span className="text-lg font-semibold text-gray-800">MedAssist</span>
      </div>

      <Button variant="default" className="cursor-pointer ">
        Login
      </Button>
    </nav>
  );
};

export default Navbar;
