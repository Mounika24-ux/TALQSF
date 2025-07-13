import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setStep(2);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        username,
        password,
      });

      alert("Signup successful!");
      localStorage.setItem("user", JSON.stringify({ username }));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ed] to-[#d7c5b4] flex items-center justify-center px-4 relative">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl w-full max-w-md transition-all">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-[#2e2e2e] mb-4 text-center">
              Enter your Email
            </h2>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-3 w-full mb-4 rounded"
              required
            />
            <button
              onClick={handleEmailSubmit}
              className="w-full py-2 text-white rounded hover:bg-[#804e2d] transition"
              style={{ backgroundColor: "#A0522D" }}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup}>
            <h2 className="text-3xl font-bold text-[#2e2e2e] mb-4 text-center">
              Create your TALQS Account
            </h2>

            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border p-3 w-full mb-3 rounded"
              required
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-3 w-full rounded pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white rounded hover:bg-[#804e2d] transition"
              style={{ backgroundColor: "#A0522D" }}
            >
              Register
            </button>
          </form>
        )}
      </div>

      {/* Optional legal icon for decoration */}
      <div className="fixed bottom-6 right-6">
        <img src="/scale-icon.svg" alt="icon" className="w-10 h-10 opacity-70" />
      </div>
    </div>
  );
}
