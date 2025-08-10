"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!identifier || !password) {
      setError("Email/Phone and password required.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }
    localStorage.setItem("accountId", data.account._id);
    router.push("/");
  }

  return (
    <div className="min-h-[70vh] flex flex-col md:flex-row bg-white">
      {/* Login Section */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16 md:py-0 md:px-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-chocolate">Log in</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Email or Phone Number"
            className="border border-gray-300 rounded-lg p-4 text-lg focus:outline-chocolate"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-gray-300 rounded-lg p-4 text-lg w-full focus:outline-chocolate"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {/* Simple eye icon */}
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span />
            <button
              type="button"
              className="text-chocolate underline"
              onClick={() => router.push("/account/forgot")}
            >
              Forgot the password?
            </button>
          </div>
          <button
            type="submit"
            className="bg-chocolate text-white rounded-lg py-3 text-lg font-semibold mt-4 hover:bg-chocolate-dark transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
      {/* Register Benefits Section */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gray-50 px-8">
        <h2 className="text-2xl font-bold mb-6 text-chocolate">Register today and benefit from:</h2>
        <ul className="mb-8 space-y-3 text-lg text-gray-700">
          <li className="flex items-center gap-2">
            <span>🎫</span> Access to your order history
          </li>
          <li className="flex items-center gap-2">
            <span>🤍</span> Faster checkout
          </li>
          <li className="flex items-center gap-2">
            <span>🛒</span> Manage and save your personal details
          </li>
        </ul>
        <button
          onClick={() => router.push("/account/register")}
          className="border-2 border-chocolate text-chocolate rounded-lg px-8 py-3 text-lg font-semibold hover:bg-chocolate hover:text-white transition"
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}