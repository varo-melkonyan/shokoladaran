import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { CartProvider } from "../context/CartContext";
import CartWidget from "@/components/CartWidget";

export const metadata = { 
  title: 'Shokoladaran',
  description: 'Chocolate Marketplace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <CartWidget />
          <main className="flex-1">
            {children}
          </main>
        </CartProvider>
        <footer className="bg-[#f8f8f8] border-t border-gray-200 mt-20 text-sm text-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-lg font-bold text-chocolate mb-3">Shokoladaran</h3>
              <p>
                Your trusted destination for handcrafted chocolate brands,
                connecting lovers of sweets to the best artisans.
              </p>
            </div>
            <div className="rounded-xl flex flex-col items-start">
              <h3 className="text-lg font-bold text-chocolate mb-2">Delivery & Pickup</h3>
              <div className="grid grid-cols-4">
                <img src="https://static.4u.am/origin/icon/13.png?v=1605895937" alt="Visa" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
                <img src="https://static.4u.am/origin/icon/14.png?v=1605896065" alt="Mastercard" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
                <img src="https://static.4u.am/origin/icon/17.png?v=1617800771" alt="Telcell Wallet" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
                <img src="https://static.4u.am/origin/icon/19.png?v=1633960821" alt="American Express" className="bg-gray-100 rounded-lg p-2 h-10 w-auto" />
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-chocolate mb-2">Contact</h4>
              <p>Email: support@shokoladaran.am</p>
              <p>Yerevan, Armenia</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-chocolate mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-chocolate">Instagram</a>
              </div>
            </div>
          </div>
          <div className="text-center py-4 border-t border-gray-200 text-gray-500">
            © {new Date().getFullYear()} Shokoladaran. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}