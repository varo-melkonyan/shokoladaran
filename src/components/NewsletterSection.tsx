"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";


export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError(`${t("please_enter_valid_email")}`);
      return;
    }
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || `${t("something_went_wrong")}`);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(`${t("something_went_wrong")}`);
    }
  }

  return (
    // bg-gray-50
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4 text-gray-600">{t("lets_stay_in_touch")}</h2>
          <p className="text-lg mb-2 text-chocolate">
            {t("sign_up_for_news")}
          </p>
        </div>
        <form className="flex-1 flex flex-col items-center md:items-end" onSubmit={handleSubmit}>
          {!submitted ? (
            <>
              <div className="flex w-full max-w-md">
                <input
                  type="email"
                  className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 text-lg focus:outline-none"
                  placeholder={t("enter_email")}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-chocolate text-white font-semibold rounded-r-lg hover:bg-chocolate transition"
                >
                  {t("subscribe_now")}
                </button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
              <p className="text-xs text-gray-500 mt-3 max-w-md text-center md:text-right">
                {t("by_subscribing")}{" "}
                <a href="/privacy" className="underline">{t("privacy_policy")}</a>. {t("unsubscribe_info")}
              </p>
            </>
          ) : (
            <div className="text-chocolate-600 font-semibold text-lg mt-2">{t("thank_you_for_subscribing")}</div>
          )}
        </form>
      </div>
    </section>
  );
}