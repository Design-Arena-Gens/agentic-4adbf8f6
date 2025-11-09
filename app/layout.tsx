import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parking Violation Detector",
  description: "Automatic vehicle detection and license plate recognition system",
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
