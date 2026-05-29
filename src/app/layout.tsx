import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maya — find care work that fits you",
  description: "Build one profile. Maya applies to every care job that fits, stores your compliance and training, and shows you the path ahead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
