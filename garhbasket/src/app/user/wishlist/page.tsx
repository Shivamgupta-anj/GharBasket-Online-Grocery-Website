'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { removeFromWishlist } from '@/redux/wishlistSlice'
import { addToCart } from '@/redux/cartSlice'

export default function WishlistPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { items } = useSelector((state: RootState) => state.wishlist)

  const handleMoveToCart = (item: any) => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    )
    dispatch(removeFromWishlist(item._id))
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> My Saved Wishlist
        </h1>
        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-4 p-6">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Save your favorite groceries to easily order them anytime.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
          >
            Explore Groceries <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3 justify-between"
            >
              <div className="relative w-16 h-16 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100">
                <Image
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div className="grow min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.unit}
                </span>
                <h3 className="text-xs font-bold text-slate-800 truncate mt-0.5">{item.name}</h3>
                <p className="text-xs font-black text-slate-900 mt-1">₹{item.price}</p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3 h-3" /> Move to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item._id))}
                  className="text-slate-400 hover:text-rose-500 text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
