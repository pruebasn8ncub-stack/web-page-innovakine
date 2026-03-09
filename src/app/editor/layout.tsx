import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor Visual | InnovaKine",
  description: "Editor visual de páginas para InnovaKine",
  robots: "noindex, nofollow",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
