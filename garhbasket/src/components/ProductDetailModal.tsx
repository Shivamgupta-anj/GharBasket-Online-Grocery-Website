'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Heart, ShieldCheck, Truck, Clock } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, increaseQuantity, decreaseQuantity } from '@/redux/cartSlice'
import { toggleWishlist } from '@/redux/wishlistSlice'
import { useRouter } from 'next/navigation'

export interface IGroceryItem {
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

interface ProductDetailModalProps {
  item: IGroceryItem | null
  onClose: () => void
}

export default function ProductDetailModal({ item, onClose }: ProductDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { cartData } = useSelector((state: RootState) => state.cart)
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist)

  if (!item) return null

  const cartItem = cartData.find((i) => i._id === item._id)
  const isWishlisted = wishlistItems.some((w) => w._id === item._id)

  const numPrice = Number(item.price) || 0
  const originalPrice = Math.round(numPrice * 1.25)
  const discountPercent = Math.round(((originalPrice - numPrice) / originalPrice) * 100)

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    )
  }

  const handleBuyNow = () => {
    if (!cartItem) {
      dispatch(
        addToCart({
          ...item,
          quantity: 1,
        })
      )
    }
    onClose()
    router.push('/user/checkout')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Top Handle / Close Bar */}
          <div className="sticky top-0 bg-white z-20 flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto sm:hidden absolute top-2 left-1/2 -translate-x-1/2" />
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {item.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch(
                    toggleWishlist({
                      _id: item._id,
                      name: item.name,
                      category: item.category,
                      price: item.price,
                      unit: item.unit,
                      image: item.image,
                    })
                  )
                }
                className={`p-2 rounded-full transition-all ${
                  isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-5">
            {/* Image display */}
            <div className="relative w-full h-56 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.name}
                fill
                className="object-contain p-4 hover:scale-105 transition-transform duration-300"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Product Title & Info */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-snug">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  Unit: {item.unit}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Quality Guaranteed
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-slate-100">
              <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
              <span className="text-sm font-medium text-slate-400 line-through">₹{originalPrice}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Save ₹{originalPrice - numPrice}
              </span>
            </div>

            {/* Delivery Promises */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/60 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Superfast Delivery</p>
                  <p className="text-slate-500 text-[11px]">In 15–30 mins</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Free Delivery</p>
                  <p className="text-slate-500 text-[11px]">On orders above ₹149</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-sm font-bold text-slate-800">Product Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description ||
                  `Fresh and high-quality ${item.name} sourced directly for your household needs. Packed with utmost hygiene and care by GharBasket.`}
              </p>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
            {!cartItem ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all text-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2">
                <button
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                  className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-xs hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-xs text-slate-500 font-medium block">In Cart</span>
                  <span className="text-sm font-black text-emerald-800">{cartItem.quantity}</span>
                </div>
                <button
                  onClick={() => dispatch(increaseQuantity(item._id))}
                  className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-xs hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-2xl text-sm shadow-md transition-all shrink-0"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
