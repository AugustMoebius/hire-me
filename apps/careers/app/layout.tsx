import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Careers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer
          style={{
            textAlign: "center",
            padding: "1.25rem",
            fontSize: "0.8rem",
            color: "#999",
          }}
        >
          Powered by Famly
        </footer>
      </body>
    </html>
  );
}
