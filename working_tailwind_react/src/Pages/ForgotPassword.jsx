import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        username,
        phone,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect after 2 sec
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-2xl border-t-4 border-[#A67B5B] p-10 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[#4B3E2A]">
          Reset Password
        </h2>

        <input
          type="text"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-[#A67B5B] text-white font-semibold rounded hover:bg-[#926d51]"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-[#5C4B3C] font-semibold">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
