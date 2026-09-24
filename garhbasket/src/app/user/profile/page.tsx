'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit2
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { signOut } from 'next-auth/react'
import EditRoleMobile from '@/components/EditRoleMobile'

export default function ProfilePage() {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)

  const menuItems = [
    {
      label: 'My Orders',
      icon: Package,
      href: '/user/my-order',
      badge: 'Active Orders',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Saved Wishlist',
      icon: Heart,
      href: '/user/wishlist',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Saved Delivery Addresses',
      icon: MapPin,
      href: '/user/checkout',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Notifications & Promo Alerts',
      icon: Bell,
      onClick: () => alert('Notifications enabled! No unread messages.'),
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Help & Customer Support',
      icon: HelpCircle,
      onClick: () => alert('Customer Support Email: support@gharbasket.com | Toll-Free: 1800-GARH-BASKET'),
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'App Settings & Privacy',
      icon: Settings,
      onClick: () => alert('GharBasket Version 2.0.0 (Mobile App Build)'),
      color: 'bg-slate-100 text-slate-600',
    },
  ]

  if (showEditRoleModal) {
    return <EditRoleMobile />
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <h1 className="text-lg font-black text-slate-800">My App Profile</h1>
        <button
          onClick={() => setShowEditRoleModal(true)}
          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs font-bold flex items-center gap-1"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-emerald-100 border-2 border-emerald-500 shadow-md shrink-0 flex items-center justify-center">
            {userData?.image ? (
              <Image src={userData.image} alt={userData?.name || 'User'} fill className="object-cover" />
            ) : (
              <User className="w-8 h-8 text-emerald-700" />
            )}
          </div>

          <div className="grow min-w-0">
            <h2 className="text-lg font-black text-slate-800 truncate">
              {userData?.name || 'GharBasket Customer'}
            </h2>
            <p className="text-xs text-slate-500 truncate">{userData?.email || 'customer@gharbasket.com'}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Mobile: {userData?.mobile || 'Not set'}
            </p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
              Role: {userData?.role || 'Customer'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Menu */}
      <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs space-y-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon
          const content = (
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                    {item.label}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          )

          if (item.href) {
            return (
              <Link key={idx} href={item.href}>
                {content}
              </Link>
            )
          }

          return (
            <div key={idx} onClick={item.onClick}>
              {content}
            </div>
          )
        })}
      </div>

      {/* Security & Logout Button */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Authenticated session secured by GharBasket NextAuth Service.</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log Out of GharBasket App
        </button>
      </div>
    </div>
  )
}
