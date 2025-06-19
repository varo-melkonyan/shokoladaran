"use client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6Lfj6GYrAAAAAEYuVmQfKXRrDNceLEqlbJBkXgGL";

export default function JoinUsPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    brandName: "",
    website: "",
    facebook: "",
    instagram: "",
    type: "PE",
    about: "",
    description: "",
  });
  
  const [captcha, setCaptcha] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captcha) {
      alert("Please complete the reCAPTCHA.");
      return;
    }
    alert("Request sent!");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] bg-[#fafafa] px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-wide">
          Join Us
        </h1>
        <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" type="email" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" required />
            <input name="brandName" value={form.brandName} onChange={handleChange} placeholder="Brand name" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" required />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website link" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" />
            <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="Facebook link" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" />
            <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram link" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition" />
            <select name="type" value={form.type} onChange={handleChange} className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base transition">
              <option value="PE">PE</option>
              <option value="LTD">LTD</option>
              <option value="LTD">OJSC</option>
              <option value="LTD">CJSC</option>
              <option value="Unregistered">Unregistered</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea name="about" value={form.about} onChange={handleChange} placeholder="About brand" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base min-h-[80px] transition" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border border-gray-300 focus:border-chocolate outline-none rounded-lg px-4 py-3 text-base min-h-[80px] transition" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
            {<ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={token => setCaptcha(token)}
            />}
            <button type="submit" className="bg-chocolate hover:bg-[#5a2d0c] text-white text-lg font-semibold rounded-lg w-full md:w-64 py-3 transition">
              Send request
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}