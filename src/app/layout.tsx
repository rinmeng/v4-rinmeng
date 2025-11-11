import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "rin meng",
  description: "Aspiring Software Engineer.",
  openGraph: {
    images: [
      {
        url: "https://rinm.dev/banner.webp",
        width: 1200,
        height: 630,
        alt: "rin meng banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://rinm.dev/banner.webp"],
  },
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
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
