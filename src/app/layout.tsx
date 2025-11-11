import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "rin meng",
  description: "Aspiring Software Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang='en' suppressHydrationWarning={true}>
        <body className={`antialiased`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
