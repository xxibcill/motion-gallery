"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllAnimations,
  searchAnimations,
  type AnimationMeta,
  type AnimationCategory,
  type AnimationDifficulty,
  type AnimationLibrary,
} from "@/lib/animation-registry";

const categoryLabels: Record<AnimationCategory, string> = {
  "scroll-based": "Scroll Based",
  "text-effects": "Text Effects",
  "hover-interactions": "Hover",
  "3d-transforms": "3D",
  "page-transitions": "Transitions",
  "layout-animations": "Layout",
};

const difficultyColors: Record<AnimationDifficulty, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const libraryColors: Record<AnimationLibrary, string> = {
  "framer-motion": "bg-purple-500/20 text-purple-400",
  gsap: "bg-green-500/20 text-green-400",
};

const colorClasses: Record<string, string> = {
  zinc: "from-zinc-800 to-zinc-900",
  slate: "from-slate-800 to-slate-950",
  indigo: "from-indigo-800 to-indigo-950",
  violet: "from-violet-800 to-violet-950",
  fuchsia: "from-fuchsia-800 to-fuchsia-950",
  emerald: "from-emerald-800 to-emerald-950",
  rose: "from-rose-800 to-rose-950",
  amber: "from-amber-800 to-amber-950",
  cyan: "from-cyan-800 to-cyan-950",
};

function AnimationCard({ animation }: { animation: AnimationMeta }) {
  const gradientClass = colorClasses[animation.color] || colorClasses.zinc;

  return (
    <Link href={animation.path}>
      <motion.div
        className="group relative h-48 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {animation.title}
            </h3>
            <p className="text-zinc-300 text-sm line-clamp-2">
              {animation.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-0.5 rounded text-xs border ${difficultyColors[animation.difficulty]}`}>
              {animation.difficulty}
            </span>
            {animation.library.map((lib) => (
              <span key={lib} className={`px-2 py-0.5 rounded text-xs ${libraryColors[lib]}`}>
                {lib === "framer-motion" ? "Framer" : "GSAP"}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded text-xs bg-zinc-700/50 text-zinc-300">
              {categoryLabels[animation.category]}
            </span>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}

export default function GalleryPage() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<AnimationCategory[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AnimationDifficulty[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<AnimationLibrary[]>([]);

  const allAnimations = getAllAnimations();

  const results = useMemo(() => {
    let filtered = query ? searchAnimations(query) : allAnimations;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((a) => selectedCategories.includes(a.category));
    }
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter((a) => selectedDifficulty.includes(a.difficulty));
    }
    if (selectedLibrary.length > 0) {
      filtered = filtered.filter((a) => a.library.some((l) => selectedLibrary.includes(l)));
    }

    return filtered;
  }, [query, selectedCategories, selectedDifficulty, selectedLibrary, allAnimations]);

  const toggleCategory = (category: AnimationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleDifficulty = (difficulty: AnimationDifficulty) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleLibrary = (library: AnimationLibrary) => {
    setSelectedLibrary((prev) =>
      prev.includes(library)
        ? prev.filter((l) => l !== library)
        : [...prev, library]
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Animation Gallery
          </motion.h1>
          <motion.p
            className="text-zinc-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Browse and discover animations for your next project
          </motion.p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search animations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryLabels) as AnimationCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-white text-zinc-900"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Difficulty */}
            <div className="flex flex-wrap gap-2">
              {(["beginner", "intermediate", "advanced"] as AnimationDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => toggleDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedDifficulty.includes(diff)
                      ? "bg-white text-zinc-900"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Library */}
            <div className="flex flex-wrap gap-2">
              {(["framer-motion", "gsap"] as AnimationLibrary[]).map((lib) => (
                <button
                  key={lib}
                  onClick={() => toggleLibrary(lib)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedLibrary.includes(lib)
                      ? lib === "framer-motion"
                        ? "bg-purple-500 text-white"
                        : "bg-green-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {lib === "framer-motion" ? "Framer Motion" : "GSAP"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-zinc-500 mb-6">
          {results.length} animation{results.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((animation, i) => (
            <motion.div
              key={animation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AnimationCard animation={animation} />
            </motion.div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No animations found</p>
            <p className="text-zinc-600 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
