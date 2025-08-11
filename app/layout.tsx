import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "My V0 Project",
  description:
    "A modern web application built with Next.js, React, and Tailwind CSS",
  generator: "v0.dev",
  keywords: ["Next.js", "React", "Tailwind CSS", "TypeScript", "v0.dev"],
  authors: [{ name: "v0.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
