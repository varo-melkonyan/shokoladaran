"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = typeof window !== "undefined" ? localStorage.getItem("accountId") : null;
    if (!accountId) {
      router.push("/account/login");
      return;
    }
    fetch(`/api/account/profile?accountId=${accountId}`)
      .then(res => res.json())
      .then(data => {
        setAccount(data.account);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-chocolate text-xl">Loading...</span>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-red-500 text-xl">Account not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 py-10 px-8 flex flex-col gap-2">
        <button className="flex items-center gap-3 py-3 px-4 rounded hover:bg-chocolate/10 text-chocolate font-medium">
          <span>
            {/* Order History Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 3v4m8-4v4"/></svg>
          </span>
          Order History
        </button>
        <button className="flex items-center gap-3 py-3 px-4 rounded bg-chocolate/10 text-chocolate font-medium">
          <span>
            {/* Account Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
          </span>
          Account Details
          <span className="ml-auto">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7l6 6M13 7l-6 6"/></svg>
          </span>
        </button>
        <button
          className="flex items-center gap-3 py-3 px-4 rounded hover:bg-chocolate/10 text-chocolate font-medium mt-8"
          onClick={() => {
            localStorage.removeItem("accountId");
            router.push("/account/login");
          }}
        >
          <span>
            {/* Logout Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="5" width="4" height="14" rx="2"/></svg>
          </span>
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-16 px-8">
        <h1 className="text-4xl font-bold mb-10 text-chocolate">Account Details</h1>
        <section className="w-full max-w-xl bg-white border border-gray-200 rounded-xl p-8 shadow flex flex-col relative">
          <h2 className="text-2xl font-semibold mb-6 text-chocolate">Account Information</h2>
          <button
            className="absolute top-8 right-8 border border-chocolate text-chocolate px-4 py-2 rounded hover:bg-chocolate hover:text-white transition"
            onClick={() => router.push("/account/edit")}
          >
            Edit details
          </button>
          <div className="space-y-4 mt-4">
            <div>
              <span className="font-semibold text-gray-700">Name</span>
              <div className="text-lg">{account.firstName}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Surname</span>
              <div className="text-lg">{account.lastName}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email</span>
              <div className="text-lg">{account.email}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Phone Number</span>
              <div className="text-lg">{account.phoneNumber || "unspecified"}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Country</span>
              <div className="text-lg">{account.country || "unspecified"}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Delivery Address</span>
              <div className="text-lg">{account.deliveryAddress || "unspecified"}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}