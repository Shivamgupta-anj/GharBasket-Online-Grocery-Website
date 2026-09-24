'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Bell, User, ChevronDown, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface AppHeaderProps {
  user?: {
    name?: string
    image?: string | null
    role?: string
  }
}

export default function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter()
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationText, setLocationText] = useState('Home — Main Market, Garhwal')

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/70 shadow-2xs">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          <span>⚡ FREE 15-Minute Express Delivery on orders above ₹149!</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Location & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg">G</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-slate-900 font-extrabold text-lg tracking-tight">GharBasket</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 uppercase">
                  App
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex flex-col text-left hover:bg-slate-50 p-1.5 rounded-xl transition-all"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery in 15 Mins</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-800 max-w-[160px] sm:max-w-[240px] truncate">
                {locationText}
              </span>
            </button>
          </div>

          {/* Right Actions: Notifications & Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/search')}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all sm:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => alert('No new notifications right now!')}
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>

            <Link href="/user/profile" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 hover:ring-2 hover:ring-emerald-500 transition-all">
                {user?.image ? (
                  <Image src={user.image} alt={user.name || 'User'} width={32} height={32} className="object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Mobile Search Input Bar */}
        <div className="px-4 pb-2.5 sm:pb-3 max-w-6xl mx-auto">
          <div
            onClick={() => router.push('/search')}
            className="flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 cursor-pointer text-slate-400 text-xs sm:text-sm font-medium transition-all shadow-2xs"
          >
            <Search className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
            <span className="grow truncate">Search for &quot;Milk&quot;, &quot;Atta&quot;, &quot;Vegetables&quot; or &quot;Snacks&quot;...</span>
          </div>
        </div>
      </header>

      {/* Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowLocationModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-emerald-600" /> Select Delivery Location
            </h3>
            <p className="text-xs text-slate-500">
              Enter your full address or area pin to view instant stock & express delivery slots.
            </p>
            <input
              type="text"
              defaultValue={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
              >
                Confirm Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
