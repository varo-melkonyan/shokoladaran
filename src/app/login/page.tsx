"use client";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = (form.elements.namedItem("username") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        await signIn("credentials", { username, password, callbackUrl: "/admin" });
      }}
      className="max-w-xs mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="mb-4 text-xl font-bold">Admin Login</h2>
      <input name="username" placeholder="Username" className="mb-2 w-full p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" className="mb-4 w-full p-2 border rounded" />
      <button type="submit" className="w-full bg-chocolate text-white py-2 rounded">Login</button>
    </form>
  );
}