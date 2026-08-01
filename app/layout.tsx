import type { Metadata } from "next";
import { Geist, Orbitron } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { UnofficialBanner } from "@/components/layout/unofficial-banner";
import { Footer } from "@/components/layout/footer";
import { buildHomeMetadata, getSiteIcons } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  ...buildHomeMetadata(),
  icons: getSiteIcons(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${orbitron.variable} font-sans`}>
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <UnofficialBanner />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 pt-4">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
