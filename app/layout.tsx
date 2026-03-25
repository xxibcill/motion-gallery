import { AnimationNav } from "@/components/animation-nav";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <AnimationNav />
        {children}
      </body>
    </html>
  );
}