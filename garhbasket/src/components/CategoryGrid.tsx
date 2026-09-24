'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Flame,
  Coffee,
  Sparkles,
  Home,
  PackageCheck,
  HeartHandshake
} from 'lucide-react'

export const CATEGORIES_LIST = [
  {
    name: 'Fruits & Vegetables',
    icon: Apple,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    query: 'Fruits & Vegetables',
  },
  {
    name: 'Dairy & Eggs',
    icon: Milk,
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-50 text-amber-600 border-amber-100',
    query: 'Dairy & Eggs',
  },
  {
    name: 'Rice, Atta & Grains',
    icon: Wheat,
    color: 'from-orange-400 to-amber-600',
    bgColor: 'bg-orange-50 text-orange-600 border-orange-100',
    query: 'Rice, Atta & Grains',
  },
  {
    name: 'Snacks & Biscuits',
    icon: Cookie,
    color: 'from-rose-400 to-pink-600',
    bgColor: 'bg-rose-50 text-rose-600 border-rose-100',
    query: 'Snacks & Biscuits',
  },
  {
    name: 'Spices & Masalas',
    icon: Flame,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50 text-red-600 border-red-100',
    query: 'Spices & Masalas',
  },
  {
    name: 'Beverages & Drinks',
    icon: Coffee,
    color: 'from-sky-400 to-blue-600',
    bgColor: 'bg-sky-50 text-sky-600 border-sky-100',
    query: 'Beverages & Drinks',
  },
  {
    name: 'Personal Care',
    icon: Sparkles,
    color: 'from-purple-400 to-indigo-600',
    bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
    query: 'Personal Care',
  },
  {
    name: 'Household Essentials',
    icon: Home,
    color: 'from-teal-400 to-emerald-600',
    bgColor: 'bg-teal-50 text-teal-600 border-teal-100',
    query: 'Household Essentials',
  },
  {
    name: 'Instant & Packaged',
    icon: PackageCheck,
    color: 'from-violet-400 to-fuchsia-600',
    bgColor: 'bg-violet-50 text-violet-600 border-violet-100',
    query: 'Instant & Packaged Food',
  },
  {
    name: 'Baby & Pet Care',
    icon: HeartHandshake,
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50 text-pink-600 border-pink-100',
    query: 'Baby & Pet Care',
  },
]

export default function CategoryGrid({ limit }: { limit?: number }) {
  const displayCategories = limit ? CATEGORIES_LIST.slice(0, limit) : CATEGORIES_LIST

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-4">
      {displayCategories.map((cat, idx) => {
        const Icon = cat.icon
        return (
          <Link key={idx} href={`/search?category=${encodeURIComponent(cat.query)}`}>
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shadow-2xs group-hover:shadow-md transition-all duration-300 ${cat.bgColor}`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1.5 line-clamp-2 leading-tight group-hover:text-emerald-700">
                {cat.name}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
