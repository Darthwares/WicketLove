import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wicket Love - Cricket Team Management",
  description: "The ultimate platform for casual cricket groups. Create balanced teams, manage matches, and track your cricket journey.",
  keywords: "cricket, team management, sports, match organization, cricket stats",
  authors: [{ name: "Wicket Love Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wicket Love",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Wicket Love - Cricket Team Management",
    description: "Organize cricket matches, create balanced teams, and track your performance",
    url: "https://wicketlove.app",
    siteName: "Wicket Love",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wicket Love - Cricket Team Management",
    description: "Organize cricket matches, create balanced teams, and track your performance",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F4C3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
