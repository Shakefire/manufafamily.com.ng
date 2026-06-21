import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "MANUFA FAMILY INVESTMENT LTD | Cooperative Savings & Strategic Investments",
  description:
    "Building a financially empowered, disciplined, and self-sustaining community through consistent savings and strategic investments.",
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <AuthProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

