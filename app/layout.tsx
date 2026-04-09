import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'StudyHub - Share Knowledge, Learn Together',
    template: '%s | StudyHub'
  },
  description: 'A collaborative platform for students to share and discover educational resources. Upload notes, write blogs, and learn together.',
  keywords: ['StudyHub', 'notes sharing', 'student resources', 'education platform', 'collaborative learning', 'academic blogs'],
  metadataBase: new URL('https://resource.kishore-sv.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resource.kishore-sv.me',
    siteName: 'StudyHub',
    title: 'StudyHub - Share Knowledge, Learn Together',
    description: 'A collaborative platform for students to share and discover educational resources.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudyHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyHub - Share Knowledge, Learn Together',
    description: 'A collaborative platform for students to share and discover educational resources.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      "/icon.svg",
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased selection:bg-blue-500 selection:text-primary-foreground`}
    >
      <head>
        <meta name="google-site-verification" content="jCZEMBZli1xqreUKnEgoNvrmaQ2RnHp56pSpl_bbPo4" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster position="top-center" closeButton richColors />

            {children}

          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
