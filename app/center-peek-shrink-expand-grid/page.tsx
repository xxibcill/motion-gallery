import { DM_Sans } from 'next/font/google'
import { CenterPeekExpandGrid } from '@/components/center-peek-expand-grid'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function CenterPeekShrinkExpandGridPage() {
  return (
    <main className={`${dmSans.className} min-h-screen bg-[#f3f4f6] text-[#202327]`}>
      <section className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#9096a2]">
            Center Peek
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-12 w-[min(46rem,86vw)] rounded-full bg-[#202327]" />
          </div>
        </div>
      </section>
      <CenterPeekExpandGrid />
    </main>
  )
}
