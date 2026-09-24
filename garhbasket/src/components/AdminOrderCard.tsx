

'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { getSocket } from '@/lib/socket'
import mongoose from 'mongoose';
import { Iuser } from '@/models/user.model';

export interface IOrder {
    _id?: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    items: [
        {
            grocery: mongoose.Types.ObjectId,
            name: string,
            price: string,
            unit: string,
            image: string,
            quantity: number
        }
    ],
    isPaid: boolean
    totalAmount: number,
    paymentMethod: "cod" | "online"
    address: {
        fullName: string,
        mobile: string,
        city: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy?: Iuser
    status: "pending" | "Out for Delivery" | "Delivered"
    createdAt?: Date
    updatedAt?: Date
}

type DeliveryBoy = {
  id: string
  name: string
  mobile: string
  latitude: number
  longitude: number
}

// Centralized status → color tokens, so the badge, accent bar, and
// dropdown text all agree with each other instead of drifting apart.
const STATUS_STYLES: Record<string, { bar: string; badge: string; icon: string }> = {
  "pending": {
    bar: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "text-amber-600",
  },
  "Out for Delivery": {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "text-blue-600",
  },
  "Delivered": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "text-emerald-600",
  },
}

function getInitials(name?: string) {
  if (!name) return "?"
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("")
}

function AdminOrderCard({ order }: { order: IOrder }) {
  const statusOptions = ["pending", "Out for Delivery", "Delivered"]
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<string>(order.status)
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([])
  const [deliveryMsg, setDeliveryMsg] = useState<string>("")

  const styles = STATUS_STYLES[status] ?? STATUS_STYLES["pending"]

  useEffect(() => {
    const socket = getSocket()

    const handleStatusUpdate = (data: any) => {
      if (data.orderId.toString() === order?._id?.toString()) {
        setStatus(data.status)
      }
    }

    if (socket?.connected) {
      socket.on("order-status-update", handleStatusUpdate)
    } else {
      socket?.on("connect", () => {
        socket.on("order-status-update", handleStatusUpdate)
      })
    }

    return () => { socket?.off("order-status-update", handleStatusUpdate) }
  }, [])

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const result = await axios.post(`/api/admin/update-order-status/${orderId}`, { status: newStatus })
      const { availableBoys, message } = result.data
      setStatus(newStatus)
      if (availableBoys && availableBoys.length > 0) {
        setDeliveryBoys(availableBoys)
        setDeliveryMsg("")
      } else if (message) {
        setDeliveryMsg(message)
        setDeliveryBoys([])
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <motion.div
      key={order._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-2xl overflow-hidden transition-shadow"
    >
      {/* Status accent bar — glance-readable without reading any text */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${styles.bar}`} />

      <div className="p-6 pl-7">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="text-lg font-bold text-gray-800 tracking-tight tabular-nums flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                Order #{order._id?.toString().slice(-6)}
              </p>

              {status !== "Delivered" && (
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  order.isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-xs font-medium">
              {new Date(order.createdAt!).toLocaleString()}
            </p>

            <div className="space-y-2 text-sm pt-1">
              <p className="flex items-center gap-2.5 text-gray-700">
                <span className="bg-gray-50 text-gray-500 rounded-full p-1.5"><User size={14} /></span>
                <span className="font-medium">{order?.address.fullName}</span>
              </p>
              <p className="flex items-center gap-2.5 text-gray-700">
                <span className="bg-gray-50 text-gray-500 rounded-full p-1.5"><Phone size={14} /></span>
                <span className="font-medium">{order?.address.mobile}</span>
              </p>
              <p className="flex items-center gap-2.5 text-gray-700">
                <span className="bg-gray-50 text-gray-500 rounded-full p-1.5"><MapPin size={14} /></span>
                <span className="font-medium">{order?.address.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2.5 text-gray-700">
                <span className="bg-gray-50 text-gray-500 rounded-full p-1.5"><CreditCard size={14} /></span>
                <span className="font-medium">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</span>
              </p>
            </div>

            {order.assignedDeliveryBoy && (
              <div className="mt-4 bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 font-semibold text-sm rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                    {getInitials(order.assignedDeliveryBoy.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{order.assignedDeliveryBoy.name}</p>
                    <p className="text-xs text-gray-500">+91 {order.assignedDeliveryBoy.mobile}</p>
                  </div>
                </div>

                <a
                  href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Call
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-2.5 shrink-0">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${styles.badge}`}>
              {status}
            </span>

            {status !== "Delivered" && (
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-emerald-400 transition focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                value={status}
                onChange={(e) => updateStatus(order._id?.toString()!, e.target.value)}
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 mt-5 pt-4">
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="w-full flex justify-between items-center text-sm font-medium text-gray-600 hover:text-emerald-700 transition"
          >
            <span className="flex items-center gap-2">
              <Package size={15} />
              {expanded ? "Hide order items" : `View ${order.items.length} item${order.items.length !== 1 ? "s" : ""}`}
            </span>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50/70 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={44}
                          height={44}
                          className="rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} · {item.unit}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 tabular-nums">
                        ₹{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck size={15} className={styles.icon} />
            <span>Delivery: <span className="font-semibold text-gray-700">{status}</span></span>
          </div>
          <div className="text-sm text-gray-500">
            Total <span className="text-gray-900 font-bold tabular-nums">₹{order.totalAmount}</span>
          </div>
        </div>

        {status === "Out for Delivery" && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
              <Truck size={15} className="text-blue-500" />
              Nearby delivery boys
            </p>

            {deliveryMsg && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {deliveryMsg}
              </p>
            )}

            {deliveryBoys.length > 0 && (
              <div className="space-y-2">
                {deliveryBoys.map((boy) => (
                  <div
                    key={boy.id}
                    className="flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="bg-blue-100 text-blue-700 font-semibold text-xs rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                        {getInitials(boy.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{boy.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={10} /> {boy.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={11} />
                      {boy.latitude.toFixed(3)}, {boy.longitude.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdminOrderCard