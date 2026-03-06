import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "Unicampo — Productos Agrícolas del Campo",
    template: "%s | Unicampo",
  },
  description:
    "Tu tienda de productos agrícolas frescos del campo. Frutas, verduras y más.",
  keywords: ["productos agrícolas", "frutas", "verduras", "campo", "ecommerce"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
