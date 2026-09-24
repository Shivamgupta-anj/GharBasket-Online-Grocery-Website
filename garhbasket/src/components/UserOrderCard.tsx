
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    CreditCard,
    MapPin,
    Package,
    Phone,
    Truck,
} from 'lucide-react'
import Image from 'next/image'
import { getSocket } from '@/lib/socket'
import mongoose from 'mongoose'
import { Iuser } from '@/models/user.model'
import { useRouter } from 'next/navigation'

export interface IOrder {
    _id?: string
    user: string
    items: [
        {
            grocery: string,
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
    assignment?: string
    assignedDeliveryBoy?: Iuser
    status: "pending" | "Out for Delivery" | "Delivered"
    createdAt?: Date
    updatedAt?: Date
}

// Quick-commerce palette: ink-black text, grocery green for progress/CTAs,
// brand yellow as the single accent, amber only for "needs attention".
const STATUS_STYLES: Record<
    string,
    { band: string; badge: string; icon: string; iconBg: string; Icon: typeof Clock; label: string }
> = {
    "pending": {
        band: "bg-[#FF9F00]",
        badge: "bg-[#FFF4E0] text-[#B75E00] border-[#FFE0A3]",
        icon: "text-[#B75E00]",
        iconBg: "bg-[#FFF4E0]",
        Icon: Clock,
        label: "Order placed",
    },
    "Out for Delivery": {
        band: "bg-[#0C831F]",
        badge: "bg-[#EAF7EC] text-[#0C831F] border-[#BEEAC5]",
        icon: "text-[#0C831F]",
        iconBg: "bg-[#EAF7EC]",
        Icon: Truck,
        label: "On the way",
    },
    "Delivered": {
        band: "bg-[#1C1C1C]",
        badge: "bg-gray-100 text-gray-700 border-gray-200",
        icon: "text-gray-700",
        iconBg: "bg-gray-100",
        Icon: CheckCircle2,
        label: "Delivered",
    },
}

function getInitials(name?: string) {
    if (!name) return "?"
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("")
}

function UserOrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState(order.status)
    const router = useRouter()

    const styles = STATUS_STYLES[status] ?? STATUS_STYLES["pending"]
    const StatusIcon = styles.Icon
    const previewItems = order.items.slice(0, 4)
    const overflowCount = order.items.length - previewItems.length

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Status band — the one loud element on the card */}
            <div className={`${styles.band} px-5 py-2.5 flex items-center justify-between`}>
                <span className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wide">
                    <StatusIcon size={14} strokeWidth={2.5} />
                    {styles.label.toUpperCase()}
                </span>
                {/* {status !== "Delivered" && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.isPaid ? "bg-white/20 text-white" : "bg-white text-red-600"
                        }`}>
                        {order.isPaid ? "PAID" : "PAY ON DELIVERY"}
                    </span>
                )} */}

                {/* {status !== "Delivered" && (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        order.isPaid
            ? "bg-white/20 text-white"
            : order.paymentMethod === "online"
                ? "bg-white text-amber-600"
                : "bg-white text-red-600"
    }`}>
        {order.isPaid
            ? "PAID"
            : order.paymentMethod === "online"
                ? "PAYMENT PENDING"
                : "PAY ON DELIVERY"}
    </span>
)} */}

{status !== "Delivered" && (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        order.isPaid
            ? "bg-white/20 text-white"
            : order.paymentMethod?.toLowerCase() === "online"
                ? "bg-white text-amber-600"
                : "bg-white text-red-600"
    }`}>
        {order.isPaid
            ? "PAID"
            : order.paymentMethod?.toLowerCase() === "online"
                ? "PAYMENT PENDING"
                : "PAY ON DELIVERY"}
    </span>
)}
            </div>

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-base font-extrabold text-[#1C1C1C] tracking-tight tabular-nums">
                            Order #{order?._id?.toString()?.slice(-6)}
                        </p>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                            {new Date(order.createdAt!).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">Total</p>
                        <p className="text-xl font-black text-[#1C1C1C] tabular-nums leading-tight">
                            ₹{order.totalAmount}
                        </p>
                    </div>
                </div>

                {/* Item thumbnail stack — glanceable "what's in the bag" */}
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className="w-full mt-4 flex items-center justify-between bg-[#FAFAF7] hover:bg-[#F5F5EE] border border-gray-100 rounded-2xl px-3 py-2.5 transition"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {previewItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative w-10 h-10 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden"
                                    style={{ zIndex: previewItems.length - index }}
                                >
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                            ))}
                            {overflowCount > 0 && (
                                <div className="relative w-10 h-10 rounded-full border-2 border-white bg-[#1C1C1C] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                                    +{overflowCount}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#0C831F]">
                        {expanded ? "Hide" : "View"}
                        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </span>
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
                            <div className="mt-2 space-y-1.5">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center rounded-xl px-3 py-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty {item.quantity} · {item.unit}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 tabular-nums">
                                            ₹{Number(item.price) * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payment + address */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 text-sm">
                    <p className="flex items-center gap-2.5 text-gray-600">
                        <span className="text-gray-400">
                            {order.paymentMethod === "cod" ? <Truck size={15} /> : <CreditCard size={15} />}
                        </span>
                        <span className="font-medium">
                            {order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
                        </span>
                    </p>
                    <p className="flex items-start gap-2.5 text-gray-600">
                        <span className="text-gray-400 mt-0.5"><MapPin size={15} /></span>
                        <span className="font-medium leading-snug">{order.address.fullAddress}</span>
                    </p>
                </div>

                {/* Rider card + track CTA — only while it's moving */}
                {order.assignedDeliveryBoy && status === "Out for Delivery" && (
                    <div className="mt-4 bg-[#FAFAF7] border border-gray-100 rounded-2xl p-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#FFC900] text-[#1C1C1C] font-black text-sm rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                    {getInitials(order.assignedDeliveryBoy.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">
                                        {order.assignedDeliveryBoy.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Your delivery partner</p>
                                </div>
                            </div>
                            <a
                                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                                aria-label="Call delivery partner"
                                className="bg-white border border-gray-200 text-[#1C1C1C] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition shrink-0"
                            >
                                <Phone size={16} />
                            </a>
                        </div>

                        <button
                            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#0C831F] text-white text-sm font-bold px-4 py-3 rounded-xl hover:bg-[#0a6f1a] active:scale-[0.99] transition"
                            onClick={() => router.push(`/user/track-order/${order._id?.toString()}`)}
                        >
                            <Truck size={16} /> Track order live
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default UserOrderCard