import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SBMS Portal",
  description: "Smart Business Management System",
};

  export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="sbms" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-base-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}