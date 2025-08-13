"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"details" | "orders">("details");

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
      <div className="flex items-center justify-center min-h-[70vh]">
        <span className="text-chocolate text-xl">Loading...</span>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <span className="text-red-500 text-xl">Account not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-white flex flex-col md:flex-row">
      {/* Mobile Header Navigation */}
      <header className="md:hidden flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <button
          className={`flex items-center gap-2 px-2 py-1 rounded font-medium ${
            view === "orders" ? "bg-chocolate/10 text-chocolate" : "text-chocolate"
          }`}
          onClick={() => setView("orders")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 3v4m8-4v4"/></svg>
          Orders
        </button>
        <button
          className={`flex items-center gap-2 px-2 py-1 rounded font-medium ${
            view === "details" ? "bg-chocolate/10 text-chocolate" : "text-chocolate"
          }`}
          onClick={() => setView("details")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
          Account
        </button>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded text-chocolate"
          onClick={() => {
            localStorage.removeItem("accountId");
            router.push("/account/login");
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="5" width="4" height="14" rx="2"/></svg>
          Exit
        </button>
      </header>
      {/* Mobile Sidebar Navigation */}
      <nav className="md:hidden flex w-full bg-white border-b border-gray-200 px-2 py-2 gap-2 justify-around pt-6">
        <button
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded font-medium ${
            view === "orders" ? "bg-chocolate/10 text-chocolate" : "text-chocolate"
          }`}
          onClick={() => setView("orders")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 3v4m8-4v4"/></svg>
          <span className="text-xs">Orders</span>
        </button>
        <button
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded font-medium ${
            view === "details" ? "bg-chocolate/10 text-chocolate" : "text-chocolate"
          }`}
          onClick={() => setView("details")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
          <span className="text-xs">Account</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-2 py-1 rounded text-chocolate"
          onClick={() => {
            localStorage.removeItem("accountId");
            router.push("/account/login");
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="5" width="4" height="14" rx="2"/></svg>
          <span className="text-xs">Exit</span>
        </button>
      </nav>
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 py-10 px-8 flex-col gap-2">
        <button
          className={`flex items-center gap-3 py-3 px-4 rounded font-medium w-full ${
            view === "orders" ? "bg-chocolate/10 text-chocolate" : "hover:bg-chocolate/10 text-chocolate"
          }`}
          onClick={() => setView("orders")}
        >
          <span>
            {/* Order History Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 3v4m8-4v4"/></svg>
          </span>
          <span className="hidden md:inline">Order History</span>
          <span className="md:hidden">Orders</span>
        </button>
        <button
          className={`flex items-center gap-3 py-3 px-4 rounded font-medium w-full ${
            view === "details" ? "bg-chocolate/10 text-chocolate" : "hover:bg-chocolate/10 text-chocolate"
          }`}
          onClick={() => setView("details")}
        >
          <span>
            {/* Account Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
          </span>
          <span className="hidden md:inline">Account Details</span>
          <span className="md:hidden">Account</span>
        </button>
        <button
          className="flex items-center gap-3 py-3 px-4 rounded hover:bg-chocolate/10 text-chocolate font-medium mt-4 md:mt-8 w-full"
          onClick={() => {
            localStorage.removeItem("accountId");
            router.push("/account/login");
          }}
        >
          <span>
            {/* Logout Icon */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="5" width="4" height="14" rx="2"/></svg>
          </span>
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden">Exit</span>
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-16 px-2 md:px-8 mt-4 md:mt-0">
        {view === "details" && (
          <>
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
          </>
        )}
        {view === "orders" && (
          <>
            <h1 className="text-4xl font-bold mb-10 text-chocolate">Order History</h1>
            <section className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow flex flex-col">
              {(!account.orders || account.orders.length === 0) ? (
                <div className="text-gray-500">No orders found.</div>
              ) : (
                <div className="space-y-6">
                  {[...account.orders]
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order: any) => {
                    // Calculate total
                    const total = order.cart.reduce(
                      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
                      0
                    );
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-chocolate">Order #{order.id}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString("hy-AM", { timeZone: "Asia/Yerevan" })}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Status:</span> {order.status}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Delivery Type:</span> {order.deliveryType}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Total:</span>{" "}
                          <span className="font-bold text-chocolate">{total.toLocaleString("hy-AM")} ֏</span>
                        </div>
                        <div>
                          <span className="font-semibold">Items:</span>
                          <ul className="list-none ml-0">
                            {order.cart.map((item: any, idx: number) => (
                              <li key={idx} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                                <a
                                  href={`/product/${item._id || item.id}`}
                                  className="flex items-center gap-4 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={item.images?.[0] || "/placeholder.png"}
                                    alt={item.name_en}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <span className="font-medium text-chocolate">
                                    {item.name_en}
                                  </span>
                                </a>
                                <span className="ml-auto text-gray-700">
                                  x {item.grams ? `${item.grams} g` : `${item.quantity} Piece`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}