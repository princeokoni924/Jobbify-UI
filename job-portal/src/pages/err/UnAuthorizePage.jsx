import Button from "../../components/Button";
import IconBadge from "../../components/IconBadge";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home, LogIn, Lock } from "lucide-react";
import UnAuthorizeCard from "../../components/Cards/UnAuthorizeCard";
const UnAuthorizePage = () => {
  const navigate = useNavigate();
  const handleHomeRoute = () => {
    navigate("/");
  };

  const handleLoginRoute = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <UnAuthorizeCard className="max-w-2xl w-full text-center">
        <IconBadge icon={Lock} variant="error" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <div className="flex items-center justify-center gap-2 mb-6">
          <AlertTriangle className="text-yellow-500" size={24} />
          <p className="text-xl text-gray-600">
            You don't have permission to view this page
          </p>
        </div>
        <p className="text-gray-500 mb-8 leading-relaxed max-w-lg mx-auto">
          This page is restricted to authorized users only. If you believe you
          should have access to this content, please contact administrator or
          try logging in with appropriate credentials.
        </p>

        {/* Btn section*/}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={handleLoginRoute} variant="primary" icon={LogIn}>
            Login
          </Button>

          <Button onClick={handleHomeRoute} variant="secondary" icon={Home}>
            Go to Home
          </Button>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Error Code:{" "}
            <span className="font-mono font-semibold text-gray-600">
              401 - Unauthorized
            </span>
          </p>
        </div>
      </UnAuthorizeCard>
    </div>
  );
};

export default UnAuthorizePage;
