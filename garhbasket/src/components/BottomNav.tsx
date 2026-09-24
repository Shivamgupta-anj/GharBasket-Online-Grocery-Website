'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { motion } from 'framer-motion'

export default function BottomNav() {
  const pathname = usePathname()
  const { cartData } = useSelector((state: RootState) => state.cart)
  const cartCount = cartData.reduce((acc, item) => acc + item.quantity, 0)

  // Hide bottom nav on admin routes, login/register routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/setup')
  ) {
    return null
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: LayoutGrid },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Cart', href: '/user/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Profile', href: '/user/profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full py-1 group transition-all"
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute -inset-2 bg-emerald-50 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-active:scale-90 ${
                    isActive ? 'text-emerald-600 font-bold stroke-[2.5]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[10px] font-black h-4 min-w-4 px-1 flex items-center justify-center rounded-full shadow-sm"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                ) : null}
              </div>
              <span
                className={`text-[11px] font-medium mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
