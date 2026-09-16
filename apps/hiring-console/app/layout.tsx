import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "../components/TopBar";

export const metadata: Metadata = {
  title: "Hiring Console",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
