"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ActivateContent() {
  const [message, setMessage] = useState("Activating your account...");
  const [activated, setActivated] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) {
      setMessage("Invalid activation link.");
      return;
    }
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid activation link.");
      return;
    }
    fetch(`/api/account/activate?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage("Your account has been activated! You can now log in.");
          setActivated(true);
        } else {
          setMessage(data.error || "Activation failed.");
        }
      })
      .catch(() => setMessage("Activation failed."));
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center text-lg">
        {message}
        {activated && (
          <div className="mt-4">
            <a href="/account/login" className="text-chocolate underline">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivateContent />
    </Suspense>
  );
}