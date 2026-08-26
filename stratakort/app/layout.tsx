import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stratakort — Turn any place into a map poster",
  description:
    "Pick a place, shape the cartography, and export a museum-quality poster of anywhere on Earth.",
  icons: {
    icon: "/stratakort-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
