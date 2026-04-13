import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { CursorFXProvider } from "@/components/fx/CursorFXProvider";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

// Font optimization with display swap
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Akash Vishwakarma | Full Stack Developer & AI Engineer",
  description: "Portfolio of Akash Vishwakarma - Full Stack Developer, AI/ML Engineer, and Open Source Contributor",
  keywords: ["Full Stack Developer", "AI Engineer", "ML Engineer", "React", "Next.js", "Python", "TypeScript"],
  authors: [{ name: "Akash Vishwakarma" }],
  creator: "Akash Vishwakarma",
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Akash Vishwakarma | Full Stack Developer & AI Engineer",
    description: "Portfolio of Akash Vishwakarma - Full Stack Developer, AI/ML Engineer, and Open Source Contributor",
    siteName: "Akash Vishwakarma Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Vishwakarma | Full Stack Developer & AI Engineer",
    description: "Portfolio of Akash Vishwakarma - Full Stack Developer, AI/ML Engineer, and Open Source Contributor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SmoothScrollProvider>
                <CursorFXProvider
                  config={{
                    magnet: true,
                    trail: false,
                    intensity: 0.5,
                    disableOnMobile: true,
                  }}
                >
                  <AppShell>{children}</AppShell>
                  <Toaster richColors position="top-right" />
                </CursorFXProvider>
              </SmoothScrollProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
