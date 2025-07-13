import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e0e2e4] flex items-center justify-center px-4">
      {/* Card with slide-in animation */}
      <div
        className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-200 animate-fade-slide"
      >
        {/* ⚖️ Legal Icon with bounce */}
        <div className="text-9xl mb-4 animate-bounce-slow">𓍝</div>

        <h1 className="text-4xl font-bold text-[#2c2c2c] mb-2">
          Welcome to <span className="text-[#5c4a3f]">TALQS</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">Your smart legal assistant</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5c4a3f] hover:bg-[#4e3d34] text-white py-2 px-6 rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#5c4a3f] hover:bg-[#4e3d34] text-white py-2 px-6 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}