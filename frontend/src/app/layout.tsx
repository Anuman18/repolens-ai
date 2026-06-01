import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoLens AI — GitHub Repository Analyzer",
  description:
    "AI-powered engineering review for any public GitHub repository. Scores, insights, and senior-level recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
