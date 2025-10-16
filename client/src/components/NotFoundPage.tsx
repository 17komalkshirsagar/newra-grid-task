import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, ArrowLeft, RefreshCw, Search } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [glitchText, setGlitchText] = useState("404");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdminRoute = location.pathname.startsWith("/admin");


  useEffect(() => {
    const chars = ["4", "0", "4", "?", "#", "@", "%"];
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const randomText = Array.from({ length: 3 }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("");
        setGlitchText(randomText);
        setTimeout(() => setGlitchText("404"), 150);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => navigate(isAdminRoute ? "/admin/dashboard" : "/");
  const handleGoBack = () => navigate(-1);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes("dashboard") || query.includes("admin"))
      navigate("/admin/dashboard");
    else if (query.includes("user")) navigate("/admin/user-management/table");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-900 px-4">

      <div className="text-center space-y-4">
        <h1 className="text-8xl md:text-9xl font-bold text-green-700 select-none">
          {glitchText}
        </h1>
        <h2 className="text-2xl font-semibold text-green-800">Page Not Found</h2>
        <p className="text-green-600 max-w-md mx-auto">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
      </div>


      <div className="mt-8 w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search something..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-3 pr-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-100 text-green-900 placeholder-green-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>


      <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={handleGoHome}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 font-medium"
        >
          <Home className="h-5 w-5 mr-2" />
          {isAdminRoute ? "Dashboard" : "Home"}
        </Button>

        <Button
          onClick={handleGoBack}
          variant="outline"
          className="flex-1 border border-green-400 text-green-700 hover:bg-green-200 rounded-lg py-3 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back
        </Button>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex-1 border border-green-400 text-green-700 hover:bg-green-200 rounded-lg py-3 font-medium"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reload
        </Button>
      </div>


      <p className="mt-10 text-sm text-green-500">
        {isAdminRoute
          ? "⚙️ Admin Dashboard"
          : "🌱 NewRa Grid – Learn, Grow, and Build"}
      </p>
    </div>
  );
};

export default NotFoundPage;
