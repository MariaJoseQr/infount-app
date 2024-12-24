
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSesionProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "INFOUNT",
  description:
    "GESTIÓN DE ASESORÍAS Y/O EVALUACIÓN DE TRABAJOS DE INVESTIGACIÓN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientSessionProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClientSessionProvider>
  );
}
