import React from "react"
import type { Metadata } from "next";
import { Sansita, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sansita = Sansita({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-sansita",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-playfair",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: {
    default: "Ana Carolina | Social Media & Estrategia Digital",
    template: "%s | Ana Carolina",
  },
  description:
    "Portfolio profissional de Ana Carolina - Social Media. Estrategia, criatividade e resultados que conectam marcas e pessoas.",
  applicationName: "Ana Carolina Portfolio",
  authors: [{ name: "Ana Carolina" }],
  generator: "Next.js",
  keywords: [
    "Social Media",
    "Marketing Digital",
    "Estrategia de Conteudo",
    "Gestao de Redes Sociais",
    "Portfolio",
    "Ana Carolina",
    "Design",
    "Branding",
  ],
  creator: "Ana Carolina",
  publisher: "Ana Carolina",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Ana Carolina | Social Media & Estrategia Digital",
    description:
      "Transformando marcas em experiencias digitais memoraveis. Estrategia, criatividade e resultados.",
    url: "https://portfolio-ana-carolina.vercel.app", // Placeholder URL
    siteName: "Ana Carolina Portfolio",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Placeholder image path
        width: 1200,
        height: 630,
        alt: "Ana Carolina - Social Media Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ana Carolina | Social Media",
    description:
      "Estrategia, criatividade e resultados que conectam. Confira meu portfolio.",
    creator: "@anacarolina", // Placeholder handle
    images: ["/twitter-image.jpg"], // Placeholder image path
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
  icons: {
    icon: "/Galdinologo.png",
    shortcut: "/Galdinologo.png",
    apple: "/Galdinologo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${sansita.variable} ${playfair.variable} ${dancing.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
