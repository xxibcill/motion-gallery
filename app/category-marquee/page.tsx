'use client'

import { motion } from 'motion/react'
import {
  Activity,
  Brain,
  Briefcase,
  Car,
  Church,
  CloudLightning,
  Coins,
  Cpu,
  FlaskConical,
  Gamepad2,
  Globe,
  Heart,
  Landmark,
  Leaf,
  Music,
  Palette,
  PawPrint,
  Plane,
  Play,
  Settings,
  Shirt,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react'
import { MarqueeRow, type Category } from '@/components/category-marquee'

const row1Categories: Category[] = [
  { name: 'Crypto', color: '#6b6bff', icon: Coins },
  { name: 'Artificial Intelligence', color: '#ff5a5c', icon: Cpu },
  { name: 'Politics', color: '#c4eb84', icon: Landmark },
  { name: 'Business & Finance', color: '#b8b8ff', icon: Briefcase },
  { name: 'Technology', color: '#ffeeb9', icon: Settings },
  { name: 'Catastrophe', color: '#a954d1', icon: CloudLightning },
  { name: 'Health & Fitness', color: '#ffdd6f', icon: Activity },
  { name: 'Entertainment', color: '#ffbfa2', icon: Play },
  { name: 'Sports', color: '#ff7d6e', icon: Trophy },
  { name: 'Lifestyle & Travel', color: '#9ffff5', icon: Plane },
  { name: 'Science', color: '#7cffc4', icon: FlaskConical },
  { name: 'Art & Literature', color: '#2ab490', icon: Palette },
  { name: 'Food & Cooking', color: '#19868d', icon: UtensilsCrossed },
]

const row2Categories: Category[] = [
  { name: 'Personal Development', color: '#2c79ff', icon: Brain },
  { name: 'Music', color: '#fa8d21', icon: Music },
  { name: 'Spirituality & Religion', color: '#ff66b4', icon: Church },
  { name: 'Gaming', color: '#bfa89e', icon: Gamepad2 },
  { name: 'Environmental & Climate', color: '#e0ab9d', icon: Leaf },
  { name: 'Pets & Animals', color: '#b99654', icon: PawPrint },
  { name: 'Automotive', color: '#af3348', icon: Car },
  { name: 'Fashion & Beauty', color: '#98c0ff', icon: Shirt },
  { name: 'Relationships & Family', color: '#ffc3ef', icon: Heart },
  { name: 'Social Issues & Activism', color: '#db3169', icon: Globe },
  { name: 'Other', color: '#59bae4', icon: Sparkles },
]

const maskStyle = {
  maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
}

export default function CategoryMarqueePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-200">
      {/* Hero Section */}
      <section className="min-h-[40vh] flex flex-col items-center justify-center px-6">
        <motion.h1
          className="text-5xl font-bold text-zinc-900 text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Category Marquee
        </motion.h1>
        <motion.p
          className="text-zinc-500 text-lg text-center max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Infinite horizontal scrolling with alternating directions and edge fade gradients
        </motion.p>
      </section>

      {/* Marquee Section */}
      <section className="py-12 space-y-6">
        <div className="px-6" style={maskStyle}>
          <MarqueeRow categories={row1Categories} direction="left" duration={35} />
        </div>

        <div className="px-6" style={maskStyle}>
          <MarqueeRow categories={row2Categories} direction="right" duration={30} />
        </div>

        <div className="px-6" style={maskStyle}>
          <MarqueeRow categories={row2Categories} direction="right" duration={28} />
        </div>

        <div className="px-6" style={maskStyle}>
          <MarqueeRow categories={row1Categories} direction="left" duration={40} />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-zinc-100 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-zinc-900 font-semibold mb-2">Infinite Scroll</h3>
              <p className="text-zinc-500 text-sm">
                Seamless loop using duplicated content with linear animation
              </p>
            </div>
            <div className="bg-zinc-100 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-zinc-900 font-semibold mb-2">Alternating Directions</h3>
              <p className="text-zinc-500 text-sm">
                Rows scroll in opposite directions for visual interest
              </p>
            </div>
            <div className="bg-zinc-100 rounded-2xl p-6 border border-zinc-200">
              <h3 className="text-zinc-900 font-semibold mb-2">Edge Fade</h3>
              <p className="text-zinc-500 text-sm">
                CSS mask gradient creates smooth fade at container edges
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
