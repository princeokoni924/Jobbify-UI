import { Briefcase } from "lucide-react";
const LoaderSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br
     from-blue-50 via-white
      to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-50 mx-auto mb-4 border-t-blue-600"/>
          <div className="absolute inset-0 flex items-center justify-center ">
                <Briefcase className="w-6 h-6 text-blue-600"/>
          </div>

        </div>
        <p className="text-gray-500 font-medium">
          <span className="block text-5xl mb-4 font-bold bg-gradient-to-r from-blue-700 via-purple-800 to-blue-700 bg-clip-text text-transparent">Jobify...!</span>
                Getting amazing opportunities...
        </p>
      </div>
    </div>
  );
};

export default LoaderSpinner;
