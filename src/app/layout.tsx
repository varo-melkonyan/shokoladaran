import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { CartProvider } from "../context/CartContext";
import Footer from "@/components/Footer";
import AiAssistantWidgetProvider from "@/components/AiAssistantWidgetProvider.client";
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
          {/* pt-[98px]  */}
          <main className="flex-1 mt-[56px] md:mt-0 md:pt-[88px]">
            {children}
          </main>
        </CartProvider>
        <AiAssistantWidgetProvider />
        <Footer />
      </body>
    </html>
  );
}