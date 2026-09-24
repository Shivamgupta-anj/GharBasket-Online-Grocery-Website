'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Minus, Heart, Eye } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { addToCart, increaseQuantity, decreaseQuantity } from '@/redux/cartSlice'
import { toggleWishlist } from '@/redux/wishlistSlice'
import ProductDetailModal from './ProductDetailModal'

export interface IGrocery {
  _id: string
  name: string
  category: string
  price: string
  unit: string
  image: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function GroceryItemCard({ item }: { item: IGrocery }) {
  const dispatch = useDispatch<AppDispatch>()
  const [showDetail, setShowDetail] = useState(false)

  const { cartData } = useSelector((state: RootState) => state.cart)
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist)

  const itemId = item._id ? item._id.toString() : ''
  const cartItem = cartData.find((i) => i._id === itemId)
  const isWishlisted = wishlistItems.some((w) => w._id === itemId)

  const numPrice = Number(item.price) || 0
  const originalPrice = Math.round(numPrice * 1.25)
  const discountPercent = Math.round(((originalPrice - numPrice) / originalPrice) * 100)

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between overflow-hidden"
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch(
              toggleWishlist({
                _id: itemId,
                name: item.name,
                category: item.category,
                price: item.price,
                unit: item.unit,
                image: item.image,
              })
            )
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-xs transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-xs'
              : 'bg-slate-900/5 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Image & Quick View trigger */}
        <div
          onClick={() => setShowDetail(true)}
          className="relative w-full aspect-square bg-slate-50/70 p-3 overflow-hidden cursor-pointer flex items-center justify-center"
        >
          <Image
            src={item.image || '/placeholder.png'}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-xs">
              <Eye className="w-3.5 h-3.5" /> View
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          <div onClick={() => setShowDetail(true)} className="cursor-pointer">
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
              {item.unit}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight min-h-[2rem]">
              {item.name}
            </h3>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div onClick={() => setShowDetail(true)} className="cursor-pointer">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-black text-slate-900">₹{item.price}</span>
                <span className="text-[11px] font-medium text-slate-400 line-through">₹{originalPrice}</span>
              </div>
            </div>

            {/* Add / Stepper Button */}
            <div>
              {!cartItem ? (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() =>
                    dispatch(
                      addToCart({
                        ...item,
                        _id: itemId,
                        quantity: 1,
                      })
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD
                </motion.button>
              ) : (
                <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl px-1.5 py-1 gap-2 shadow-2xs">
                  <button
                    onClick={() => dispatch(decreaseQuantity(itemId))}
                    className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-emerald-800 min-w-3 text-center">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(increaseQuantity(itemId))}
                    className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      {showDetail && (
        <ProductDetailModal
          item={{
            ...item,
            _id: itemId,
          }}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
}