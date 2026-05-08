import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import WhatsAppLink from "./components/whatsaapWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DataSwap — Buy MTN, Telecel & AT data instantly",
  description:
    "Top up your wallet once, then send MTN, Telecel, AT and AFA bundles to any number in seconds. Built for Ghana.",
  icons: { icon: '/dataswap-logo.jpeg' },
  openGraph: {
    title: "DataSwap",
    description: "Buy MTN, Telecel & AT data bundles instantly.",
    images: [
      {
        url: '/dataswap-logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'DataSwap',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <WhatsAppLink />
        <Footer />
      </body>
    </html>
  );
}