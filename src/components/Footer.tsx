"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#f8f8f8] border-t border-gray-200 mt-20 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div>
          <h3 className="text-lg font-bold text-chocolate mb-3">Shokoladaran</h3>
          <p>{t("footer_text")}</p>
        </div>
        <div className="rounded-xl flex flex-col items-start">
          <h3 className="text-lg font-bold text-chocolate mb-2">{t("delivery_pickup")}</h3>
          <div className="grid grid-cols-4">
            <img src="https://static.4u.am/origin/icon/13.png?v=1605895937" alt="Visa" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
            <img src="https://static.4u.am/origin/icon/14.png?v=1605896065" alt="Mastercard" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
            <img src="https://static.4u.am/origin/icon/17.png?v=1617800771" alt="Telcell Wallet" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
            <img src="https://static.4u.am/origin/icon/19.png?v=1633960821" alt="American Express" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-chocolate mb-2">{t("contact")}</h4>
          <p>Email: support@shokoladaran.am</p>
          <p>Yerevan, Armenia</p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-chocolate mb-2">{t("follow_us")}</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-chocolate">Instagram</a>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-chocolate mb-2">{t("company")}</h4>
          <div className="flex flex-col space-y-2">
            <Link href="/about_us" className="hover:underline text-chocolate flex items-center gap-2">
              <span>{t("about_us")}</span>
            </Link>
            <Link href="/join_us" className="hover:underline text-chocolate flex items-center gap-2">
              <span>{t("join_us")}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-200 text-gray-500">
        © {new Date().getFullYear()} Shokoladaran. All rights reserved
      </div>
    </footer>
  );
}