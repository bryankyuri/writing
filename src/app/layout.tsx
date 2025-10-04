import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppProvider } from "./_lib/Context/appContext";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESC - Object Writing",
  description: "Earhouse Songwriting Club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakartaSans.variable} ${poppins.variable} font-poppins`}>
        <AppProvider>
          <Providers>{children}</Providers>
        </AppProvider>
      </body>
    </html>
  );
}
