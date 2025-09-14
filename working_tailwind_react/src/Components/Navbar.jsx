import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import { HelpCircle, LogOut, Clock, Moon } from "lucide-react";

export default function Navbar({ togglePopup, popupRef }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const { isDark, setIsDark } = useDarkMode();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      navigate("/");
    }, 1500); // simulate delay
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-5 bg-[#625750] dark:bg-[#2c2c2c] shadow-md py-7">
      <nav className="flex justify-between items-center px-5 text-sm max-w-screen-xl mx-auto">
        {/* Left: Fun Fact + Logo */}
        <div className="flex items-center gap-4">
          <button
            ref={popupRef}
            onClick={togglePopup}
            className="text-3xl bg-white text-[#5C4B3C] px-4 py-2 rounded-full hover:bg-[#e4e4e4] dark:hover:bg-gray-600 transition font-bold"
            title="Click for fun legal fact"
          >
            𓍝
          </button>
          <div className="font-bold text-6xl text-white">TALQS</div>
        </div>

        {/* Right: Navigation Links */}
        <ul className="flex gap-6 text-white text-lg justify-end flex-1 items-center relative">
          <li><Link to="/home" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/features" className="hover:underline">Top Features</Link></li>
          <li><Link to="/learn" className="hover:underline">Learn</Link></li>

          {/* Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white hover:underline font-semibold transition"
            >
              ☰ Options
            </button>

            {dropdownOpen && (
              <div className="absolute right-[-6px] mt-2 w-44 bg-white dark:bg-[#333] text-[#625750] dark:text-[#f0f0f0] rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/latest");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <HelpCircle size={18} />
                  Help
                </button>
                <button
                  onClick={() => {
                    navigate("/history");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Clock size={18} />
                  History
                </button>
                {/* <button
                  onClick={() => {
                    navigate("/quiz");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                𖡎  Quiz
                </button> */}
                <button
                  onClick={() => {
                    setIsDark(!isDark);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Moon size={18} />
                  {isDark ? "Switch to Light" : "Switch to Dark"}
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* 🔴 Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2e2e2e] p-6 rounded-xl shadow-lg w-80 text-center">
            {!isLoggingOut ? (
              <>
                <p className="text-xl font-semibold mb-4" style={{ color: "#5C4B3C" }}>
                  Are you sure you want to logout?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 min-w-[110px]"
                  >
                    Yes, I want
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                    No, thanks
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2E2E] mb-4"></div>
                <p className="text-[#4B2E2E] font-bold">THANKS FOR VISITING TALQS</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
