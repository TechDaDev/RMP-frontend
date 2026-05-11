import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "منصة الرافدين الطبية الرقمية | Al-Rafidain Digital Medical Platform",
  description:
    "منصة طبية رقمية آمنة تربط المريض بالطبيب والمختبر والصيدلية في تجربة موحدة ومنظمة.",
  keywords: [
    "منصة الرافدين الطبية الرقمية",
    "Al-Rafidain Digital Medical Platform",
    "digital healthcare",
    "Iraq medical platform",
    "healthcare coordination",
  ],
  authors: [{ name: "TechDaDev" }],
  creator: "TechDaDev",
  openGraph: {
    title: "منصة الرافدين الطبية الرقمية | Al-Rafidain Digital Medical Platform",
    description:
      "A secure digital medical platform connecting patients, doctors, laboratories, and pharmacies in one organized healthcare experience.",
    type: "website",
    locale: "ar_IQ",
    siteName: "Al-Rafidain Digital Medical Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Rafidain Digital Medical Platform",
    description:
      "A secure digital medical platform connecting patients, doctors, laboratories, and pharmacies.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#081625" },
  ],
};

const preferencesBootstrap = `(function(){
  try {
    var d=document.documentElement;
    var locale=localStorage.getItem("rmp-language");
    if(locale!=="ar"&&locale!=="ku"&&locale!=="en"){locale="ar";}
    d.lang=locale;
    d.dir=locale==="en"?"ltr":"rtl";

    var theme=localStorage.getItem("rmp-theme");
    if(theme!=="light"&&theme!=="dark"){
      theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
    }
    if(theme==="dark") d.classList.add("dark");
    else d.classList.remove("dark");
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesBootstrap }} />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
