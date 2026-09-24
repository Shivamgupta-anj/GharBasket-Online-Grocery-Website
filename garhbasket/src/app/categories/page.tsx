'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ChevronRight } from 'lucide-react'
import { CATEGORIES_LIST } from '@/components/CategoryGrid'

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = CATEGORIES_LIST.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-800">All Categories</h1>
          <p className="text-xs text-slate-500">Explore groceries by category</p>
        </div>
      </div>

      {/* Category Search Filter Input */}
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-2xs">
        <Search className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter categories (e.g. Dairy, Fruits, Snacks)..."
          className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium"
        />
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredCategories.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <Link key={idx} href={`/search?category=${encodeURIComponent(cat.query)}`}>
              <motion.div
                whileTap={{ scale: 0.96 }}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.bgColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">Explore items</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
