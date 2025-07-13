import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.includes("@") || !username.includes("gmail.com")) {
      setUsernameError("⚠️ Please enter a valid Gmail address.");
      return;
    }

    setUsernameError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify({ username: res.data.username }));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-4 border-[#5C4A3F]"
      >
        <h1 className="text-4xl font-bold text-center text-[#3C2F28] mb-2">
          TALQS
        </h1>
        <p className="text-lg text-center text-gray-600 mb-6">
          Login to your account
        </p>

        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Enter your Gmail"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError("");
          }}
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4A3F]"
          required
        />
        {usernameError && (
          <p className="text-red-600 text-sm mb-4">{usernameError}</p>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4A3F]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-[#5C4A3F] transition"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="text-right mb-6">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#5C4A3F] hover:underline focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#5C4A3F] text-white font-semibold rounded-lg hover:bg-[#4A3B33] transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
