import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { RoleProvider } from "@/components/role-provider";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rinf purchase order system",
  description: "Smart order tracking tool",
  icons: {
    icon: [
      {
        url: "/10112496.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/10112496.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/10112496.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/10112496.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <RoleProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </RoleProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
