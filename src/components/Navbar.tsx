import { FileText } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 mx-5">
        <div className="flex items-center justify-left h-16">  {/* Changed justify-between to justify-center */}
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-3xl text-gray-800">
              Ai Text Beautifier
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
