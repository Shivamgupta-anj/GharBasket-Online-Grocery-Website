'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { increaseQuantity, decreaseQuantity, removeFromCart } from '@/redux/cartSlice'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart
  )

  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()

    if (code === 'GHAR30' || code === 'WELCOME10') {
      const discount = Math.round(subTotal * 0.15)
      setCouponDiscount(discount)
      setCouponApplied(true)
    } else if (code === 'FREESHIP') {
      setCouponDiscount(deliveryFee)
      setCouponApplied(true)
    } else {
      setCouponError('Invalid coupon code. Try GHAR30 or WELCOME10')
    }
  }

  const grandTotal = Math.max(0, finalTotal - couponDiscount)

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
          <ShoppingBag className="w-5 h-5 text-emerald-600" /> My Shopping Cart
        </h1>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          {cartData.length} {cartData.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {cartData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-4 p-6"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800">Your basket is empty</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Looks like you haven&apos;t added any groceries to your cart yet.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            Start Grocery Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Cart Items
            </h2>
            <div className="space-y-3 divide-y divide-slate-100">
              <AnimatePresence>
                {cartData.map((item) => {
                  const itemId = item._id || ''
                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 flex items-center gap-3"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-slate-50 rounded-2xl p-2 shrink-0 border border-slate-100">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Title & Price */}
                      <div className="grow min-w-0">
                        <h3 className="text-xs font-bold text-slate-800 truncate">{item.name}</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Unit: {item.unit}</p>
                        <p className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{Number(item.price) * item.quantity}
                        </p>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 gap-2 shrink-0">
                        <button
                          onClick={() => dispatch(decreaseQuantity(itemId))}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-2xs hover:bg-emerald-50 active:scale-90 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(increaseQuantity(itemId))}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-2xs hover:bg-emerald-50 active:scale-90 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" /> Apply Coupon Code
            </h2>
            {couponApplied ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 font-bold">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Coupon &quot;{couponCode.toUpperCase()}&quot; Applied!
                </span>
                <button
                  onClick={() => {
                    setCouponApplied(false)
                    setCouponDiscount(0)
                    setCouponCode('')
                  }}
                  className="text-xs text-slate-500 hover:text-rose-600 underline font-normal"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Try 'GHAR30' or 'WELCOME10'"
                  className="grow border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-emerald-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] font-semibold text-rose-500">{couponError}</p>}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Bill Summary
            </h2>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Delivery Fee
                </span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                )}
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>To Pay</span>
                <span className="text-base text-emerald-700">₹{grandTotal}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe & Hygienic Packaging. Guaranteed 100% Quality Assurance.</span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      {cartData.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 p-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
              <p className="text-lg font-black text-slate-900">₹{grandTotal}</p>
            </div>
            <button
              onClick={() => router.push('/user/checkout')}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}