import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children }) {
  return (
    <nav className="fixed top-6 left-6 z-50 h-full flex flex-col gap-1">
      <Link href="/" className="text-zinc-400 hover:text-zinc-500 transition-colors">
        Home
      </Link>
      <Link href="/gsap" className="text-indigo-400 hover:text-indigo-300 transition-colors">
        GSAP
      </Link>
      <Link href="/parallax" className="text-violet-400 hover:text-violet-300 transition-colors">
        Parallax
      </Link>
      <Link href="/text-reveal" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
        Text Reveal
      </Link>
      <Link href="/horizontal" className="text-emerald-400 hover:text-emerald-300 transition-colors">
        Horizontal
      </Link>
      <Link href="/magnetic" className="text-rose-400 hover:text-rose-300 transition-colors">
        Magnetic
      </Link>
      <Link href="/reveal" className="text-amber-400 hover:text-amber-300 transition-colors">
        Reveal
      </Link>
      <Link href="/3d" className="text-cyan-400 hover:text-cyan-300 transition-colors">
        3D
      </Link>
    </nav>
  );
}