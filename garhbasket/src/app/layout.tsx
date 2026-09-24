import type { Metadata, Viewport } from "next";
import "./globals.css";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "GharBasket | 15-Minute Express Grocery Mobile App",
  description: "Get fresh fruits, vegetables, dairy, snacks & household essentials delivered in 15 minutes or less with GharBasket.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GharBasket",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
            <BottomNav />
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
