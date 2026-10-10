import { DM_Mono, DM_Sans, DM_Serif_Display } from "next/font/google";
import type { Metadata } from "next";

import { ClientAnalytics } from "@/components/analytics/client-analytics";
import "@/app/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"]
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"]
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"]
});

export const metadata: Metadata = {
  title: "Biz Coach - Company Brain Builder",
  description: "Turn tribal knowledge into an AI-ready company brain in 20 minutes.",
  openGraph: {
    title: "Biz Coach - Company Brain Builder",
    description: "5 questions. 3 structured files. 1 live API endpoint your team can query on day one.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${dmMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <ClientAnalytics />
      </body>
    </html>
  );
}
