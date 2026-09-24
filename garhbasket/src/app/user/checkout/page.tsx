// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/redux/store'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   ArrowLeft,
//   MapPin,
//   User,
//   Phone,
//   Home,
//   Building,
//   Locate,
//   LocateFixed,
//   CreditCard,
//   Truck,
//   CheckCircle2,
//   Clock,
//   ShieldCheck,
//   ArrowRight
// } from 'lucide-react'
// import axios from 'axios'
// import dynamic from 'next/dynamic'
// import 'leaflet/dist/leaflet.css'

// // Dynamically import Leaflet Map to avoid SSR issues
// const MapComponent = dynamic(
//   () =>
//     import('react-leaflet').then(async (mod) => {
//       const L = (await import('leaflet')).default

//       const markerIcon = new L.Icon({
//         iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
//         iconSize: [36, 36],
//         iconAnchor: [18, 36],
//       })

//       const { MapContainer, TileLayer, Marker, useMap } = mod

//       const RecenterMap = ({ position }: { position: [number, number] }) => {
//         const map = useMap()
//         useEffect(() => {
//           map.setView(position, 15, { animate: true })
//         }, [position, map])
//         return null
//       }

//       const DraggableMarker = ({
//         position,
//         setPosition,
//       }: {
//         position: [number, number]
//         setPosition: (p: [number, number]) => void
//       }) => {
//         return (
//           <Marker
//             icon={markerIcon}
//             position={position}
//             draggable={true}
//             eventHandlers={{
//               dragend: (e: L.LeafletEvent) => {
//                 const marker = e.target as L.Marker
//                 const { lat, lng } = marker.getLatLng()
//                 setPosition([lat, lng])
//               },
//             }}
//           />
//         )
//       }

//       return function LeafletMap({
//         position,
//         setPosition,
//       }: {
//         position: [number, number]
//         setPosition: (p: [number, number]) => void
//       }) {
//         return (
//           <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <RecenterMap position={position} />
//             <DraggableMarker position={position} setPosition={setPosition} />
//           </MapContainer>
//         )
//       }, { ssr: false }
// )

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { userData } = useSelector((state: RootState) => state.user)
//   const { cartData, finalTotal } = useSelector((state: RootState) => state.cart)

//   const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)
//   const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
//   const [deliverySlot, setDeliverySlot] = useState('Express 15-30 Mins')
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [address, setAddress] = useState({
//     fullName: userData?.name || '',
//     mobile: userData?.mobile || '',
//     city: 'Garhwal',
//     pincode: '246001',
//     fullAddress: '',
//   })

//   const [searchQuery, setSearchQuery] = useState('')
//   const [position, setPosition] = useState<[number, number] | null>([30.15, 78.5])

//   useEffect(() => {
//     if (userData) {
//       setAddress((prev) => ({
//         ...prev,
//         fullName: userData.name || prev.fullName,
//         mobile: userData.mobile || prev.mobile,
//       }))
//     }
//   }, [userData])

//   // Get user geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords
//           setPosition([latitude, longitude])
//         },
//         (err) => console.log('Geolocation error:', err),
//         { enableHighAccuracy: true, timeout: 10000 }
//       )
//     }
//   }, [])

//   // Reverse Geocoding via OpenStreetMap Nominatim
//   useEffect(() => {
//     const fetchAddress = async () => {
//       if (!position) return
//       try {
//         const res = await axios.get(
//           `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
//         )
//         const addr = res.data.address
//         setAddress((prev) => ({
//           ...prev,
//           city: addr.city || addr.town || addr.village || addr.county || prev.city,
//           pincode: addr.postcode || prev.pincode,
//           fullAddress: res.data.display_name || prev.fullAddress,
//         }))
//       } catch (err) {
//         console.log('Reverse geocode error:', err)
//       }
//     }
//     fetchAddress()
//   }, [position])

//   const handleSearchLocation = async () => {
//     if (!searchQuery.trim()) return
//     try {
//       const res = await axios.get(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
//       )
//       if (res.data && res.data.length > 0) {
//         const { lat, lon } = res.data[0]
//         setPosition([parseFloat(lat), parseFloat(lon)])
//       } else {
//         alert('No location results found.')
//       }
//     } catch (err) {
//       console.log('Location search error:', err)
//     }
//   }

//   // Handle Place Order logic
//   const handlePlaceOrder = async () => {
//     if (!position) {
//       alert('Please select your delivery address location.')
//       return
//     }
//     if (!address.fullName || !address.mobile || !address.fullAddress) {
//       alert('Please fill out all required address fields.')
//       return
//     }

//     setIsSubmitting(true)

//     const orderPayload = {
//       userId: userData?._id,
//       items: cartData.map((item) => ({
//         grocery: item._id,
//         name: item.name,
//         price: item.price,
//         unit: item.unit,
//         quantity: item.quantity,
//         image: item.image,
//       })),
//       totalAmount: finalTotal,
//       address: {
//         fullName: address.fullName,
//         mobile: address.mobile,
//         city: address.city,
//         pincode: address.pincode,
//         fullAddress: address.fullAddress,
//         latitude: position[0],
//         longitude: position[1],
//       },
//       paymentMethod,
//     }

//     try {
//       if (paymentMethod === 'cod') {
//         await axios.post('/api/user/order', orderPayload)
//         router.push('/user/order-success')
//       } else {
//         const res = await axios.post('/api/user/payment', orderPayload)
//         if (res.data && res.data.url) {
//           window.location.href = res.data.url
//         } else {
//           alert('Failed to initiate online payment session.')
//         }
//       }
//     } catch (err) {
//       console.error('Order placement error:', err)
//       alert('An error occurred while placing your order. Please try again.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const steps = [
//     { id: 1, title: 'Address' },
//     { id: 2, title: 'Slot' },
//     { id: 3, title: 'Payment' },
//     { id: 4, title: 'Review' },
//   ]

//   return (
//     <div className="min-h-screen bg-slate-50 pb-28 max-w-3xl mx-auto px-4 py-4 space-y-4">
//       {/* Top Header */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() => router.back()}
//           className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-semibold"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Cart
//         </button>
//         <h1 className="text-lg font-black text-slate-800">Checkout</h1>
//         <div className="w-16" />
//       </div>

//       {/* Mobile Stepper Bar */}
//       <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center justify-between">
//         {steps.map((s, idx) => (
//           <React.Fragment key={s.id}>
//             <div
//               onClick={() => setActiveStep(s.id as any)}
//               className="flex items-center gap-1.5 cursor-pointer"
//             >
//               <div
//                 className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
//                   activeStep >= s.id
//                     ? 'bg-emerald-600 text-white shadow-xs'
//                     : 'bg-slate-100 text-slate-400'
//                 }`}
//               >
//                 {activeStep > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
//               </div>
//               <span
//                 className={`text-xs font-bold hidden sm:inline ${
//                   activeStep === s.id ? 'text-emerald-700' : 'text-slate-500'
//                 }`}
//               >
//                 {s.title}
//               </span>
//             </div>
//             {idx < steps.length - 1 && (
//               <div
//                 className={`h-0.5 grow mx-1.5 rounded-full transition-all ${
//                   activeStep > s.id ? 'bg-emerald-500' : 'bg-slate-200'
//                 }`}
//               />
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Step 1: Address */}
//       {activeStep === 1 && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//           <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
//             <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
//               <MapPin className="text-emerald-600" /> Delivery Address & Pin Location
//             </h2>

//             <div className="space-y-3">
//               <div className="relative">
//                 <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   value={address.fullName}
//                   onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
//                   placeholder="Full Name"
//                   className="pl-9 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div className="relative">
//                 <Phone className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   value={address.mobile}
//                   onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
//                   placeholder="Mobile Number"
//                   className="pl-9 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div className="relative">
//                 <Home className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   value={address.fullAddress}
//                   onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
//                   placeholder="House/Flat No., Street Name, Area"
//                   className="pl-9 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="relative">
//                   <Building className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     value={address.city}
//                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                     placeholder="City"
//                     className="pl-9 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-emerald-500"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Locate className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     value={address.pincode}
//                     onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
//                     placeholder="Pincode"
//                     className="pl-9 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-emerald-500"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search map location..."
//                   className="grow border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleSearchLocation}
//                   className="bg-slate-900 text-white font-bold text-xs px-4 rounded-xl"
//                 >
//                   Locate
//                 </button>
//               </div>

//               {/* Map Locator Component */}
//               <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200">
//                 {position && <MapComponent position={position} setPosition={setPosition} />}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (navigator.geolocation) {
//                       navigator.geolocation.getCurrentPosition((pos) => {
//                         setPosition([pos.coords.latitude, pos.coords.longitude])
//                       })
//                     }
//                   }}
//                   className="absolute bottom-3 right-3 z-10 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg hover:bg-emerald-700 transition"
//                   aria-label="Use current location"
//                 >
//                   <LocateFixed className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={() => setActiveStep(2)}
//               className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
//             >
//               Continue to Delivery Slot
//             </button>
//           </div>
//         </motion.div>
//       )}

//       {/* Step 2: Delivery Slot */}
//       {activeStep === 2 && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//           <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
//             <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
//               <Clock className="text-emerald-600" /> Select Delivery Time Slot
//             </h2>

//             <div className="space-y-3">
//               {[
//                 { name: 'Express 15-30 Mins', desc: 'Instant dispatch by nearest GharBasket rider', icon: Truck },
//                 { name: 'Today Evening (5 PM - 8 PM)', desc: 'Standard evening delivery slot', icon: Clock },
//                 { name: 'Tomorrow Morning (7 AM - 10 AM)', desc: 'Early morning fresh delivery', icon: Clock },
//               ].map((slot) => {
//                 const Icon = slot.icon
//                 return (
//                   <div
//                     key={slot.name}
//                     onClick={() => setDeliverySlot(slot.name)}
//                     className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
//                       deliverySlot === slot.name
//                         ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
//                         : 'border-slate-100 hover:bg-slate-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 border border-slate-200">
//                         <Icon className="w-5 h-5" />
//                       </div>
//                       <div>
//                         <p className="text-xs font-bold text-slate-800">{slot.name}</p>
//                         <p className="text-[11px] text-slate-500">{slot.desc}</p>
//                       </div>
//                     </div>
//                     {deliverySlot === slot.name && (
//                       <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
//                     )}
//                   </div>
//                 )
//               })}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setActiveStep(1)}
//                 className="py-3 px-4 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={() => setActiveStep(3)}
//                 className="grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
//               >
//                 Continue to Payment
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Step 3: Payment Method */}
//       {activeStep === 3 && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//           <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
//             <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
//               <CreditCard className="text-emerald-600" /> Select Payment Method
//             </h2>

//             <div className="space-y-3">
//               <div
//                 onClick={() => setPaymentMethod('cod')}
//                 className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
//                   paymentMethod === 'cod'
//                     ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
//                     : 'border-slate-100 hover:bg-slate-50'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs border border-amber-200">
//                     COD
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-slate-800">Cash / UPI on Delivery</p>
//                     <p className="text-[11px] text-slate-500">Pay cash or scan QR upon delivery</p>
//                   </div>
//                 </div>
//                 {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
//               </div>

//               <div
//                 onClick={() => setPaymentMethod('online')}
//                 className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
//                   paymentMethod === 'online'
//                     ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
//                     : 'border-slate-100 hover:bg-slate-50'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs border border-purple-200">
//                     CARD
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-slate-800">Online Payment (Stripe / Cards / UPI)</p>
//                     <p className="text-[11px] text-slate-500">Instant secure checkout via Stripe</p>
//                   </div>
//                 </div>
//                 {paymentMethod === 'online' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setActiveStep(2)}
//                 className="py-3 px-4 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={() => setActiveStep(4)}
//                 className="grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
//               >
//                 Review Order
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Step 4: Final Order Review */}
//       {activeStep === 4 && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//           <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
//             <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
//               <ShieldCheck className="text-emerald-600" /> Order Summary & Review
//             </h2>

//             <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
//               <p className="font-bold text-slate-900 text-sm">Delivery To:</p>
//               <p className="font-semibold text-slate-800">{address.fullName} ({address.mobile})</p>
//               <p>{address.fullAddress}, {address.city} - {address.pincode}</p>
//               <div className="border-t border-slate-200 my-2 pt-2 flex justify-between">
//                 <span>Selected Slot:</span>
//                 <span className="font-bold text-emerald-700">{deliverySlot}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Payment Mode:</span>
//                 <span className="font-bold uppercase text-slate-900">{paymentMethod}</span>
//               </div>
//             </div>

//             {/* Total */}
//             <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Final Order Amount</p>
//                 <p className="text-xl font-black text-slate-900">₹{finalTotal}</p>
//               </div>
//               <button
//                 disabled={isSubmitting}
//                 onClick={handlePlaceOrder}
//                 className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
//               >
//                 {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }

// // // // 'use client'

// // // // import React, { useState,useEffect } from 'react'
// // // // import {motion} from 'framer-motion'
// // // // import { ArrowLeft, MapPin, User , Phone, Home, Building, Locate } from 'lucide-react'
// // // // import { useRouter} from 'next/navigation'
// // // // import { useSelector  } from 'react-redux'
// // // // import { RootState } from '@/redux/store'

// // // // function Checkout() {
// // // //     const router = useRouter()
// // // //     const {userData}=useSelector((state:RootState)=>state.user)
    
// // // //     const [address,setAddress]=useState({
// // // //         fullName:userData?.name || "",
// // // //         mobile:userData?.mobile || "",
// // // //         city:"",
// // // //         pincode:"",
// // // //         fullAddress:"",
// // // //     })
// // // //     useEffect(() => {
// // // //     if (userData) {
// // // //         setAddress({
// // // //             fullName: userData.name || "",
// // // //             mobile: userData.mobile || "",
// // // //             city: "",
// // // //             pincode: "",
// // // //             fullAddress: "",
// // // //         })
// // // //     }
// // // // }, [userData])

// // // // const [position,setPosition]=useState<[number,number]|null>(null)

// // // // useEffect(()=>{
// // // //     if(navigator.geolocation){
// // // //         navigator.geolocation.getCurrentPosition((pos)=>console.log(pos))
// // // //     }
// // // // },[])


// // // //   return (
// // // //     <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">

// // // //         <motion.div className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        
// // // //         whileTap={{scale:0.97}}
// // // //         onClick={()=>router.push("/user/cart")}
// // // //         >

// // // //             <ArrowLeft size={16}/>
// // // //             <span>Back to cart</span>

// // // //         </motion.div>

// // // //          <motion.h1
                
// // // //                 className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
// // // //             >
// // // //                 Checkout
// // // //             </motion.h1>

// // // //             <div className='grid md:grid-cols-2 gap-8'>
// // // //                 <motion.div
// // // //                 initial={{opacity:0,x:-20}}
// // // //                 animate={{opacity:1,x:0}}
// // // //                 transition={{duration:0.3}}

// // // //                 className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
// // // //                 >
// // // //                     <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
// // // //                         <MapPin className='text-gray-700' /> Delivery Address
// // // //                     </h2>

// // // //                     <div className='space-y-4'>
// // // //                         <div className='relative'>
// // // //                             <User className='absolute left-3 top-3 text-gray-600' size={20}/>
// // // //                            <input
// // // //                                 type='text'
// // // //                                 value={address.fullName || ""}
// // // //                                 onChange={(e)=>setAddress({...address,fullName:e.target.value})}
// // // //                             />

// // // //                         <div className='relative'>
// // // //                             <Phone className='absolute left-3 top-3 text-gray-600' size={20}/>
// // // //                            <input
// // // //                                 type='text'
// // // //                                 value={address.mobile || ""}
// // // //                                 onChange={(e)=>setAddress({...address,mobile:e.target.value})}
// // // //                             />
// // // //                         </div>


// // // //                         <div className='relative'>
// // // //                             <Home className='absolute left-3 top-3 text-gray-600' size={20}/>
// // // //                             <input type='text' value={address.fullAddress } onChange={(e)=>setAddress({...address,fullAddress:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' placeholder='Full Address'/>
// // // //                         </div>


// // // //                         <div className='grid grid-cols-3 gap-3'>
// // // //                             <div className='relative'>
// // // //                                 <Building className='absolute left-3 top-3 text-gray-600' size={20}/>
// // // //                                 <input type='text' value={address.city } onChange={(e)=>setAddress({...address,city:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' placeholder='Enter City'/>
// // // //                             </div>
// // // //                             <div className='relative'>
// // // //                                 <Locate className='absolute left-3 top-3 text-gray-600' size={20}/>
// // // //                                 <input type='text' value={address.pincode } onChange={(e)=>setAddress({...address,pincode:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50' placeholder='Pin Code'/>
// // // //                             </div>

// // // //                         </div>

// // // //                         <div className='flex gap-2 mt-3'>
// // // //                             <input type="text" placeholder='Search CIty or Area....' className='flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none' />
// // // //                             <button className='bg-gray-600 hover:bg-green-600 transiton-all font-medium text-white px-5 rounded-lg '>Search</button>
// // // //                         </div>


// // // //                     </div>

// // // //                 </motion.div>

// // // //             </div>
      
// // // //     </div>
// // // //   )
// // // // }

// // // // export default Checkout

// // // 'use client'

// // // import React, { useState, useEffect } from 'react'
// // // import { motion } from 'framer-motion'
// // // import {
// // //     ArrowLeft,
// // //     MapPin,
// // //     User,
// // //     Phone,
// // //     Home,
// // //     Building,
// // //     Locate
// // // } from 'lucide-react'
// // // import { useRouter } from 'next/navigation'
// // // import { useSelector } from 'react-redux'
// // // import { RootState } from '@/redux/store'
// // // import L, { LatLngExpression} from 'leaflet'
// // // import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
// // // import "leaflet/dist/leaflet.css"
// // // import axios from 'axios'
// // // import { OpenStreetMapProvider } from 'leaflet-geosearch'

// // // const markerIcon= new L.Icon({
// // //     iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png",
// // //     iconSize:[40,40],
// // //     iconAnchor:[20,40]
// // // })
// // // function Checkout() {
// // //     const router = useRouter()

// // //     const { userData } = useSelector(
// // //         (state: RootState) => state.user
// // //     )

// // //     const [address, setAddress] = useState({
// // //         fullName: userData?.name || "",
// // //         mobile: userData?.mobile || "",
// // //         city: "",
// // //         pincode: "",
// // //         fullAddress: "",
// // //     })

// // //     const [searchQuery,setSearchQuery]=useState("")

// // //     useEffect(() => {
// // //         if (userData) {
// // //             setAddress({
// // //                 fullName: userData.name || "",
// // //                 mobile: userData.mobile || "",
// // //                 city: "",
// // //                 pincode: "",
// // //                 fullAddress: "",
// // //             })
// // //         }
// // //     }, [userData]) 

// // //     const [position, setPosition] = useState<[number, number] | null>(null)

// // //     useEffect(() => {
// // //         if (navigator.geolocation) {
// // //             navigator.geolocation.getCurrentPosition((pos) =>{
// // //                 const {latitude,longitude}=pos.coords
// // //                 setPosition([latitude,longitude])
// // //             },(err)=>{console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000}
                
// // //             )
// // //         }
// // //     }, [])

// // //     const DraggableMarker : React.FC=()=>{
// // //         const map = useMap()
// // //         useEffect(()=>{
// // //             map.setView(position as LatLngExpression,15,{animate:true})
// // //         },[position,map])
       


// // //         return <Marker icon={markerIcon} position={position as LatLngExpression} draggable={true} eventHandlers={{dragend:(e:L.LeafletEvent)=>{
// // //                                 const marker = e.target as L.Marker
// // //                                 const {lat,lng}=marker.getLatLng()
// // //                                 setPosition([lat,lng])
// // //                             }}}/>
// // //     }

// // //     // const handleSearchQuery=async()=>{
// // //     //     const provider = new OpenStreetMapProvider();
// // //     //     const results = await provider.search({query: searchQuery})
// // //     //     // console.log(results)
// // //     //     if(results){
// // //     //         setPosition([results[0].y, results[0].x])
// // //     //     }
// // //     // }

// // //     const handleSearchQuery = async () => {
// // //     if (!searchQuery.trim()) return
// // //     try {
// // //         const result = await axios.get(
// // //             `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
// // //         )

// // //         if (result.data.length === 0) {
// // //             alert("No results found")
// // //             return
// // //         }

// // //         const { lat, lon } = result.data[0]
// // //         setPosition([parseFloat(lat), parseFloat(lon)])  // moves map + triggers fetchAddress

// // //     } catch (err) {
// // //         console.log("Search error:", err)
// // //     }
// // // }


// // //     useEffect(()=>{
// // //         const fetchAddress = async ()=>{
// // //             if(!position) return
// // //             try{
// // //                 const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
// // //                 console.log(result.data)
// // //                 setAddress(prev=>({...prev,city:result.data.address.town,
// // //                     fullAddress:result.data.display_name
// // //                 }))
// // //             }catch(err){
// // //                 console.log(err)
// // //             }
// // //         }
// // //         fetchAddress()
// // //     },[position])

// // //     return (
// // //         <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
// // //             <motion.div
// // //                 className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
// // //                 whileTap={{ scale: 0.97 }}
// // //                 onClick={() => router.push('/user/cart')}
// // //             >
// // //                 <ArrowLeft size={16} />
// // //                 <span>Back to cart</span>
// // //             </motion.div>

// // //             <motion.h1
// // //                 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
// // //             >
// // //                 Checkout
// // //             </motion.h1>

// // //             <div className="grid md:grid-cols-2 gap-8">
// // //                 <motion.div
// // //                     initial={{ opacity: 0, x: -20 }}
// // //                     animate={{ opacity: 1, x: 0 }}
// // //                     transition={{ duration: 0.3 }}
// // //                     className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
// // //                 >
// // //                     <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // //                         <MapPin className="text-gray-700" />
// // //                         Delivery Address
// // //                     </h2>

// // //                     <div className="space-y-4">
// // //                         <div className="relative">
// // //                             <User
// // //                                 className="absolute left-3 top-3 text-gray-600"
// // //                                 size={20}
// // //                             />
// // //                             <input
// // //                                 type="text"
// // //                                 value={address.fullName || ""}
// // //                                 onChange={(e) =>
// // //                                     setAddress({
// // //                                         ...address,
// // //                                         fullName: e.target.value,
// // //                                     })
// // //                                 }
// // //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// // //                             />
// // //                         </div>

// // //                         <div className="relative">
// // //                             <Phone
// // //                                 className="absolute left-3 top-3 text-gray-600"
// // //                                 size={20}
// // //                             />
// // //                             <input
// // //                                 type="text"
// // //                                 value={address.mobile || ""}
// // //                                 onChange={(e) =>
// // //                                     setAddress({
// // //                                         ...address,
// // //                                         mobile: e.target.value,
// // //                                     })
// // //                                 }
// // //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// // //                             />
// // //                         </div>

// // //                         <div className="relative">
// // //                             <Home
// // //                                 className="absolute left-3 top-3 text-gray-600"
// // //                                 size={20}
// // //                             />
// // //                             <input
// // //                                 type="text"
// // //                                 value={address.fullAddress || ""}
// // //                                 onChange={(e) =>
// // //                                     setAddress({
// // //                                         ...address,
// // //                                         fullAddress: e.target.value,
// // //                                     })
// // //                                 }
// // //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// // //                                 placeholder="Full Address"
// // //                             />
// // //                         </div>

// // //                         <div className="grid grid-cols-3 gap-3">
// // //                             <div className="relative">
// // //                                 <Building
// // //                                     className="absolute left-3 top-3 text-gray-600"
// // //                                     size={20}
// // //                                 />
// // //                                 <input
// // //                                     type="text"
// // //                                     value={address.city || ""}
// // //                                     onChange={(e) =>
// // //                                         setAddress({
// // //                                             ...address,
// // //                                             city: e.target.value,
// // //                                         })
// // //                                     }
// // //                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// // //                                     placeholder="Enter City"
// // //                                 />
// // //                             </div>

// // //                             <div className="relative">
// // //                                 <Locate
// // //                                     className="absolute left-3 top-3 text-gray-600"
// // //                                     size={20}
// // //                                 />
// // //                                 <input
// // //                                     type="text"
// // //                                     value={address.pincode || ""}
// // //                                     onChange={(e) =>
// // //                                         setAddress({
// // //                                             ...address,
// // //                                             pincode: e.target.value,
// // //                                         })
// // //                                     }
// // //                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// // //                                     placeholder="Pin Code"
// // //                                 />
// // //                             </div>
// // //                         </div>

// // //                         <div className="flex gap-2 mt-3">
// // //                             <input
// // //                                 type="text"
// // //                                 placeholder="Search CIty or Area...."
// // //                                 className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onClick={handleSearchQuery}
// // //                             />
// // //                             <button className="bg-gray-600 hover:bg-green-600 transition-all font-medium text-white px-5 rounded-lg">
// // //                                 Search
// // //                             </button>
// // //                         </div>

// // //                         {/* map  */}


// // //                         <div className='relative mt-6 h-[330px] roundex-xl overflow-hidden border border-gray-200 shadow-inner'>

// // //                            {position && <MapContainer key={position.toString()} center={position as LatLngExpression} zoom={15}  scrollWheelZoom={true} className='w-full h-full'>
// // //                             <TileLayer
// // //                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // //                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //                             />
// // //                             {/* <Marker position={position}>
// // //                             <Popup>
// // //                                 A pretty CSS3 popup. <br /> Easily customizable.
// // //                             </Popup>
// // //                             </Marker> */}
// // //                             <DraggableMarker />
// // //                         </MapContainer>}
                            
// // //                         </div>


// // //                     </div>
// // //                 </motion.div>
// // //             </div>
// // //         </div>
// // //     )
// // // }

// // // export default Checkout




// // 'use client'

// // import React, { useState, useEffect } from 'react'
// // import { motion } from 'framer-motion'
// // import {
// //     ArrowLeft,
// //     MapPin,
// //     User,
// //     Phone,
// //     Home,
// //     Building,
// //     Locate,
// //     Search,
// //     LocateFixed,
// //     CreditCard,
// //     CreditCardIcon,
// //     Truck
// // } from 'lucide-react'
// // import { useRouter } from 'next/navigation'
// // import { useSelector } from 'react-redux'
// // import { RootState } from '@/redux/store'
// // import axios from 'axios'
// // import dynamic from 'next/dynamic'
// // // ✅ Add at top level
// // import 'leaflet/dist/leaflet.css'
// // const Map = dynamic(() => import('react-leaflet').then(async (mod) => {
// //     const L = (await import('leaflet')).default

    
    

// //     // const markerIcon = new L.Icon({
// //     //     iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
// //     //     iconSize: [40, 40],
// //     //     iconAnchor: [20, 40]
// //     // })

// //     const { MapContainer, TileLayer, Marker, useMap } = mod

// //     const RecenterMap = ({ position }: { position: [number, number] }) => {
// //         const map = useMap()
// //         useEffect(() => {
// //             map.setView(position, 15, { animate: true })
// //         }, [position, map])
// //         return null
// //     }

// //     // const DraggableMarker = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
// //     //     return (
// //     //         <Marker
// //     //             icon={markerIcon}
// //     //             position={position}
// //     //             draggable={true}
// //     //             eventHandlers={{
// //     //                 dragend: (e: L.LeafletEvent) => {
// //     //                     const marker = e.target as L.Marker
// //     //                     const { lat, lng } = marker.getLatLng()
// //     //                     setPosition([lat, lng])
// //     //                 }
// //     //             }}
// //     //         />
// //     //     )
// //     // }

// //     const MapComponent = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
// //         return (
// //             <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
// //                 <TileLayer
// //                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 />
// //                 <RecenterMap position={position} />
// //                 <DraggableMarker position={position} setPosition={setPosition} />
// //             </MapContainer>
// //         )
// //     }

// //     return MapComponent
// // }), { ssr: false })

// // function Checkout() {
// //     const router = useRouter()
// //     const [paymentMethod,setPaymentMethod]=useState<"cod"| "online">("cod")

// //     const { userData } = useSelector((state: RootState) => state.user)
// //     const { subTotal,deliveryFee,finalTotal,cartData } = useSelector((state: RootState) => state.cart)

// //     const [address, setAddress] = useState({
// //         fullName: userData?.name || "",
// //         mobile: userData?.mobile || "",
// //         city: "",
// //         pincode: "",
// //         fullAddress: "",
// //     })

// //     const [searchQuery, setSearchQuery] = useState("")
// //     const [position, setPosition] = useState<[number, number] | null>(null)

// //     useEffect(() => {
// //         if (userData) {
// //             setAddress({
// //                 fullName: userData.name || "",
// //                 mobile: userData.mobile || "",
// //                 city: "",
// //                 pincode: "",
// //                 fullAddress: "",
// //             })
// //         }
// //     }, [userData])



// //     const handleCod=async()=>{
// //         if(!position){
// //             return  null
// //         }
// //         try{
// //             const result = await axios.post("/api/user/order",{
// //                 userId:userData?._id,
// //                 items:cartData.map(item=>(
// //                     {
// //                         grocery:item._id,
// //                         name:item.name,
// //                         price:item.price,
// //                         unit:item.unit,
// //                         quantity:item.quantity,
// //                         image:item.image
// //                     }
// //                 )),
// //                 totalAmount:finalTotal,
// //                 address:{
// //                     fullName:address.fullName,
// //                     mobile:address.mobile,
// //                     city:address.city,
// //                     fullAddress:address.fullAddress,
// //                     pincode:address.pincode,
// //                     latitude:position[0],
// //                     longitude:position[1]
// //                 },
// //                 paymentMethod
// //             })
// //             router.push("/user/order-success")
// //         }catch(err){
// //             console.log(err)

// //         }
// //     }

// //     const handleOnlinePayment = async ()=>{
// //          if(!position){
// //             return  null
// //         }
// //         try{
// //             const result = await axios.post("/api/user/payment",{
// //                 userId:userData?._id,
// //                 items:cartData.map(item=>(
// //                     {
// //                         grocery:item._id,
// //                         name:item.name,
// //                         price:item.price,
// //                         unit:item.unit,
// //                         quantity:item.quantity,
// //                         image:item.image
// //                     }
// //                 )),
// //                 totalAmount:finalTotal,
// //                 address:{
// //                     fullName:address.fullName,
// //                     mobile:address.mobile,
// //                     city:address.city,
// //                     fullAddress:address.fullAddress,
// //                     pincode:address.pincode,
// //                     latitude:position[0],
// //                     longitude:position[1]
// //                 },
// //                 paymentMethod
// //             })
// //             window.location.href=result.data.url

// //         }catch(err){
// //             console.log(err)
// //         }

// //     }


// //     useEffect(() => {
// //         if (navigator.geolocation) {
// //             navigator.geolocation.getCurrentPosition(
// //                 (pos) => {
// //                     const { latitude, longitude } = pos.coords
// //                     setPosition([latitude, longitude])
// //                 },
// //                 (err) => { console.log('location error', err) },
// //                 { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
// //             )
// //         }
// //     }, [])

// //     useEffect(() => {
// //         const fetchAddress = async () => {
// //             if (!position) return
// //             try {
// //                 const result = await axios.get(
// //                     `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
// //                 )
// //                 const addr = result.data.address
// //                 setAddress(prev => ({
// //                     ...prev,
// //                     city: addr.city || addr.town || addr.village || addr.county || "",
// //                     pincode: addr.postcode || prev.pincode,
// //                     fullAddress: result.data.display_name
// //                 }))
// //             } catch (err) {
// //                 console.log(err)
// //             }
// //         }
// //         fetchAddress()
// //     }, [position])

// //     const handleSearchQuery = async () => {
// //         if (!searchQuery.trim()) return
// //         try {
// //             const result = await axios.get(
// //                 `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
// //             )
// //             if (result.data.length === 0) {
// //                 alert("No results found")
// //                 return
// //             }
// //             const { lat, lon } = result.data[0]
// //             setPosition([parseFloat(lat), parseFloat(lon)])
// //         } catch (err) {
// //             console.log("Search error:", err)
// //         }
// //     }

// //     return (
// //         <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
// //             <motion.div
// //                 className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
// //                 whileTap={{ scale: 0.97 }}
// //                 onClick={() => router.push('/user/cart')}
// //             >
// //                 <ArrowLeft size={16} />
// //                 <span>Back to cart</span>
// //             </motion.div>

// //             <motion.h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
// //                 Checkout
// //             </motion.h1>

// //             <div className="grid md:grid-cols-2 gap-8">
// //                 <motion.div
// //                     initial={{ opacity: 0, x: -20 }}
// //                     animate={{ opacity: 1, x: 0 }}
// //                     transition={{ duration: 0.3 }}
// //                     className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
// //                 >
// //                     <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //                         <MapPin className="text-gray-700" />
// //                         Delivery Address
// //                     </h2>

// //                     <div className="space-y-4">
// //                         <div className="relative">
// //                             <User className="absolute left-3 top-3 text-gray-600" size={20} />
// //                             <input
// //                                 type="text"
// //                                 value={address.fullName || ""}
// //                                 onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
// //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// //                                 placeholder="Full Name"
// //                             />
// //                         </div>

// //                         <div className="relative">
// //                             <Phone className="absolute left-3 top-3 text-gray-600" size={20} />
// //                             <input
// //                                 type="text"
// //                                 value={address.mobile || ""}
// //                                 onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
// //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// //                                 placeholder="Mobile"
// //                             />
// //                         </div>

// //                         <div className="relative">
// //                             <Home className="absolute left-3 top-3 text-gray-600" size={20} />
// //                             <input
// //                                 type="text"
// //                                 value={address.fullAddress || ""}
// //                                 onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
// //                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// //                                 placeholder="Full Address"
// //                             />
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-3">
// //                             <div className="relative">
// //                                 <Building className="absolute left-3 top-3 text-gray-600" size={20} />
// //                                 <input
// //                                     type="text"
// //                                     value={address.city || ""}
// //                                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
// //                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// //                                     placeholder="Enter City"
// //                                 />
// //                             </div>

// //                             <div className="relative">
// //                                 <Locate className="absolute left-3 top-3 text-gray-600" size={20} />
// //                                 <input
// //                                     type="text"
// //                                     value={address.pincode || ""}
// //                                     onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
// //                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
// //                                     placeholder="Pin Code"
// //                                 />
// //                             </div>
// //                         </div>

// //                         <div className="flex gap-2 mt-3">
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search City or Area...."
// //                                 className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
// //                                 value={searchQuery}
// //                                 onChange={(e) => setSearchQuery(e.target.value)}
// //                                 onKeyDown={(e) => e.key === "Enter" && handleSearchQuery()}
// //                             />
// //                             <button
// //                                 onClick={handleSearchQuery}
// //                                 className="bg-gray-600 hover:bg-green-600 transition-all font-medium text-white px-5 rounded-lg"
// //                             >
// //                                 Search
// //                             </button>
// //                         </div>

// //                         <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
// //                             {position && 
// //                             (
// //                                 <Map position={position} setPosition={setPosition} />
// //                             )}
// //                              <motion.button
// //                                 whileTap={{ scale: 0.9 }}
// //                                 onClick={() => {
// //                                     navigator.geolocation.getCurrentPosition((pos) => {
// //                                         setPosition([pos.coords.latitude, pos.coords.longitude])
// //                                     })
// //                                 }}
// //                                 className='absolute bottom-4 right-4 bg-gray-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-[999]'
// //                             >
// //                                 <LocateFixed size={22} />
// //                             </motion.button>
// //                         </div>

                        
// //                     </div>
// //                 </motion.div>

// //                 <motion.div 
// //                 initial={{opacity:0,x:20}}
// //                 animate={{opacity:1,x:0}}
// //                 transition={{duration:0.3}}
// //                 className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit'
// //                 >
// //                     <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'> <CreditCard className='text-black-500'/> Payment Method</h2>

// //                     <div className='space-y-4 mb-6'>
// //                         {/* online */}
// //                         <button onClick={()=>setPaymentMethod("online")}
// //                         className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod==="online"?"border-green-600 bg-green-50 shadow-sm":"hover:bg-gray-50"}`}>
// //                             <CreditCardIcon className='text-gray-600'/> <span className='font-medium text-gray-700'>Pay Online (stripe)</span>
// //                         </button>


// //                         {/* cod */}
// //                         <button 
// //                         onClick={()=>setPaymentMethod("cod")}
// //                         className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod==="cod"?"border-green-600 bg-green-50 shadow-sm":"hover:bg-gray-50"}`}>
// //                             <Truck className='text-gray-600'/> <span className='font-medium text-gray-700'>Cash On Delivery</span>
// //                         </button>

// //                     </div>

// //                     <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>

// //                         <div className='flex justify-between'>
// //                             <span>Sub-Total : </span>
// //                             <span className='font-semibold text-black'>₹ {subTotal}</span>
// //                         </div>

// //                         <div className='flex justify-between'>
// //                             <span>Deliver Fee : </span>
// //                             <span className='font-semibold text-black'>{deliveryFee}</span>
// //                         </div>

// //                         <div className='flex justify-between font-bold text-lg border-t pt-3'>
// //                             <span>Final Total : </span>
// //                             <span className='font-semibold text-black'>{finalTotal}</span>
// //                         </div>

// //                     </div>

// //                     <motion.button whileTap={{scale:0.93}} className='w-full mt-6 bg-gray-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold'
// //                     onClick={()=>{
// //                         if(paymentMethod=="cod"){
// //                             handleCod()
// //                         }else{
                           
// //                             handleOnlinePayment()
// //                         }

// //                     }}
// //                     >
// //                         {paymentMethod=="cod"?"Place Order":"Pay & Place Order"}
// //                     </motion.button>
                    

// //                 </motion.div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default Checkout

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import {
//     ArrowLeft,
//     MapPin,
//     User,
//     Phone,
//     Home,
//     Building,
//     Locate,
//     Search,
//     LocateFixed,
//     CreditCard,
//     CreditCardIcon,
//     Truck
// } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/redux/store'
// import axios from 'axios'
// import dynamic from 'next/dynamic'
// import 'leaflet/dist/leaflet.css'

// const Map = dynamic(() => import('react-leaflet').then(async (mod) => {
//     const L = (await import('leaflet')).default

//     const markerIcon = new L.Icon({
//         iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
//         iconSize: [40, 40],
//         iconAnchor: [20, 40]
//     })

//     const { MapContainer, TileLayer, Marker, useMap } = mod

//     const RecenterMap = ({ position }: { position: [number, number] }) => {
//         const map = useMap()
//         useEffect(() => {
//             map.setView(position, 15, { animate: true })
//         }, [position, map])
//         return null
//     }

//     const DraggableMarker = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
//         return (
//             <Marker
//                 icon={markerIcon}
//                 position={position}
//                 draggable={true}
//                 eventHandlers={{
//                     dragend: (e: L.LeafletEvent) => {
//                         const marker = e.target as L.Marker
//                         const { lat, lng } = marker.getLatLng()
//                         setPosition([lat, lng])
//                     }
//                 }}
//             />
//         )
//     }

//     const MapComponent = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
//         return (
//             <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <RecenterMap position={position} />
//                 <DraggableMarker position={position} setPosition={setPosition} />
//             </MapContainer>
//         )
//     }

//     return MapComponent
// }), { ssr: false })

// function Checkout() {
//     const router = useRouter()
//     const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")

//     const { userData } = useSelector((state: RootState) => state.user)
//     const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart)

//     const [address, setAddress] = useState({
//         fullName: userData?.name || "",
//         mobile: userData?.mobile || "",
//         city: "",
//         pincode: "",
//         fullAddress: "",
//     })

//     const [searchQuery, setSearchQuery] = useState("")
//     const [position, setPosition] = useState<[number, number] | null>(null)

//     useEffect(() => {
//         if (userData) {
//             setAddress({
//                 fullName: userData.name || "",
//                 mobile: userData.mobile || "",
//                 city: "",
//                 pincode: "",
//                 fullAddress: "",
//             })
//         }
//     }, [userData])

//     const handleCod = async () => {
//         if (!position) {
//             return null
//         }
//         try {
//             const result = await axios.post("/api/user/order", {
//                 userId: userData?._id,
//                 items: cartData.map(item => (
//                     {
//                         grocery: item._id,
//                         name: item.name,
//                         price: item.price,
//                         unit: item.unit,
//                         quantity: item.quantity,
//                         image: item.image
//                     }
//                 )),
//                 totalAmount: finalTotal,
//                 address: {
//                     fullName: address.fullName,
//                     mobile: address.mobile,
//                     city: address.city,
//                     fullAddress: address.fullAddress,
//                     pincode: address.pincode,
//                     latitude: position[0],
//                     longitude: position[1]
//                 },
//                 paymentMethod
//             })
//             router.push("/user/order-success")
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     const handleOnlinePayment = async () => {
//         if (!position) {
//             return null
//         }
//         try {
//             const result = await axios.post("/api/user/payment", {
//                 userId: userData?._id,
//                 items: cartData.map(item => (
//                     {
//                         grocery: item._id,
//                         name: item.name,
//                         price: item.price,
//                         unit: item.unit,
//                         quantity: item.quantity,
//                         image: item.image
//                     }
//                 )),
//                 totalAmount: finalTotal,
//                 address: {
//                     fullName: address.fullName,
//                     mobile: address.mobile,
//                     city: address.city,
//                     fullAddress: address.fullAddress,
//                     pincode: address.pincode,
//                     latitude: position[0],
//                     longitude: position[1]
//                 },
//                 paymentMethod
//             })
//             window.location.href = result.data.url

//         } catch (err) {
//             console.log(err)
//         }
//     }

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (pos) => {
//                     const { latitude, longitude } = pos.coords
//                     setPosition([latitude, longitude])
//                 },
//                 (err) => { console.log('location error', err) },
//                 { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//             )
//         }
//     }, [])

//     useEffect(() => {
//         const fetchAddress = async () => {
//             if (!position) return
//             try {
//                 const result = await axios.get(
//                     `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
//                 )
//                 const addr = result.data.address
//                 setAddress(prev => ({
//                     ...prev,
//                     city: addr.city || addr.town || addr.village || addr.county || "",
//                     pincode: addr.postcode || prev.pincode,
//                     fullAddress: result.data.display_name
//                 }))
//             } catch (err) {
//                 console.log(err)
//             }
//         }
//         fetchAddress()
//     }, [position])

//     const handleSearchQuery = async () => {
//         if (!searchQuery.trim()) return
//         try {
//             const result = await axios.get(
//                 `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
//             )
//             if (result.data.length === 0) {
//                 alert("No results found")
//                 return
//             }
//             const { lat, lon } = result.data[0]
//             setPosition([parseFloat(lat), parseFloat(lon)])
//         } catch (err) {
//             console.log("Search error:", err)
//         }
//     }

//     return (
//         <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
//             <motion.div
//                 className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => router.push('/user/cart')}
//             >
//                 <ArrowLeft size={16} />
//                 <span>Back to cart</span>
//             </motion.div>

//             <motion.h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
//                 Checkout
//             </motion.h1>

//             <div className="grid md:grid-cols-2 gap-8">
//                 <motion.div
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
//                 >
//                     <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                         <MapPin className="text-gray-700" />
//                         Delivery Address
//                     </h2>

//                     <div className="space-y-4">
//                         <div className="relative">
//                             <User className="absolute left-3 top-3 text-gray-600" size={20} />
//                             <input
//                                 type="text"
//                                 value={address.fullName || ""}
//                                 onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
//                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                                 placeholder="Full Name"
//                             />
//                         </div>

//                         <div className="relative">
//                             <Phone className="absolute left-3 top-3 text-gray-600" size={20} />
//                             <input
//                                 type="text"
//                                 value={address.mobile || ""}
//                                 onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
//                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                                 placeholder="Mobile"
//                             />
//                         </div>

//                         <div className="relative">
//                             <Home className="absolute left-3 top-3 text-gray-600" size={20} />
//                             <input
//                                 type="text"
//                                 value={address.fullAddress || ""}
//                                 onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
//                                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                                 placeholder="Full Address"
//                             />
//                         </div>

//                         <div className="grid grid-cols-3 gap-3">
//                             <div className="relative">
//                                 <Building className="absolute left-3 top-3 text-gray-600" size={20} />
//                                 <input
//                                     type="text"
//                                     value={address.city || ""}
//                                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                                     placeholder="Enter City"
//                                 />
//                             </div>

//                             <div className="relative">
//                                 <Locate className="absolute left-3 top-3 text-gray-600" size={20} />
//                                 <input
//                                     type="text"
//                                     value={address.pincode || ""}
//                                     onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
//                                     className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                                     placeholder="Pin Code"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex gap-2 mt-3">
//                             <input
//                                 type="text"
//                                 placeholder="Search City or Area...."
//                                 className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 onKeyDown={(e) => e.key === "Enter" && handleSearchQuery()}
//                             />
//                             <button
//                                 onClick={handleSearchQuery}
//                                 className="bg-gray-600 hover:bg-green-600 transition-all font-medium text-white px-5 rounded-lg"
//                             >
//                                 Search
//                             </button>
//                         </div>

//                         <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
//                             {position &&
//                                 (
//                                     <Map position={position} setPosition={setPosition} />
//                                 )}
//                             <motion.button
//                                 whileTap={{ scale: 0.9 }}
//                                 onClick={() => {
//                                     navigator.geolocation.getCurrentPosition((pos) => {
//                                         setPosition([pos.coords.latitude, pos.coords.longitude])
//                                     })
//                                 }}
//                                 className='absolute bottom-4 right-4 bg-gray-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-[999]'
//                             >
//                                 <LocateFixed size={22} />
//                             </motion.button>
//                         </div>

//                     </div>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit'
//                 >
//                     <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'> <CreditCard className='text-black-500' /> Payment Method</h2>

//                     <div className='space-y-4 mb-6'>
//                         {/* online */}
//                         <button onClick={() => setPaymentMethod("online")}
//                             className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "online" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}>
//                             <CreditCardIcon className='text-gray-600' /> <span className='font-medium text-gray-700'>Pay Online (stripe)</span>
//                         </button>

//                         {/* cod */}
//                         <button
//                             onClick={() => setPaymentMethod("cod")}
//                             className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "cod" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}>
//                             <Truck className='text-gray-600' /> <span className='font-medium text-gray-700'>Cash On Delivery</span>
//                         </button>
//                     </div>

//                     <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
//                         <div className='flex justify-between'>
//                             <span>Sub-Total : </span>
//                             <span className='font-semibold text-black'>₹ {subTotal}</span>
//                         </div>

//                         <div className='flex justify-between'>
//                             <span>Deliver Fee : </span>
//                             <span className='font-semibold text-black'>{deliveryFee}</span>
//                         </div>

//                         <div className='flex justify-between font-bold text-lg border-t pt-3'>
//                             <span>Final Total : </span>
//                             <span className='font-semibold text-black'>{finalTotal}</span>
//                         </div>
//                     </div>

//                     <motion.button whileTap={{ scale: 0.93 }} className='w-full mt-6 bg-gray-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold'
//                         onClick={() => {
//                             if (paymentMethod == "cod") {
//                                 handleCod()
//                             } else {
//                                 handleOnlinePayment()
//                             }
//                         }}
//                     >
//                         {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
//                     </motion.button>

//                 </motion.div>
//             </div>
//         </div>
//     )
// }

// export default Checkout

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    MapPin,
    User,
    Phone,
    Home,
    Building,
    Locate,
    LocateFixed,
    CreditCard,
    CreditCardIcon,
    Truck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import axios from 'axios'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const Map = dynamic(() => import('react-leaflet').then(async (mod) => {
    const L = (await import('leaflet')).default

    const markerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    })

    const { MapContainer, TileLayer, Marker, useMap } = mod

    const RecenterMap = ({ position }: { position: [number, number] }) => {
        const map = useMap()
        useEffect(() => {
            map.setView(position, 15, { animate: true })
        }, [position, map])
        return null
    }

    const DraggableMarker = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
        return (
            <Marker
                icon={markerIcon}
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend: (e: L.LeafletEvent) => {
                        const marker = e.target as L.Marker
                        const { lat, lng } = marker.getLatLng()
                        setPosition([lat, lng])
                    }
                }}
            />
        )
    }

    const MapComponent = ({ position, setPosition }: { position: [number, number], setPosition: (p: [number, number]) => void }) => {
        return (
            <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap position={position} />
                <DraggableMarker position={position} setPosition={setPosition} />
            </MapContainer>
        )
    }

    return MapComponent
}), { ssr: false })

function Checkout() {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")

    const { userData } = useSelector((state: RootState) => state.user)
    const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart)

    const [address, setAddress] = useState({
        fullName: userData?.name || "",
        mobile: userData?.mobile || "",
        city: "",
        pincode: "",
        fullAddress: "",
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [locationError, setLocationError] = useState("")

    useEffect(() => {
        if (userData) {
            setAddress({
                fullName: userData.name || "",
                mobile: userData.mobile || "",
                city: "",
                pincode: "",
                fullAddress: "",
            })
        }
    }, [userData])

    const requestLocation = () => {
        setLocationError("")
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported on this device.")
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                setPosition([latitude, longitude])
            },
            (err) => {
                console.log('location error', err)
                setLocationError("Location access denied. Please allow location permission or search your area manually below.")
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        )
    }

    const handleCod = async () => {
        if (!position) {
            alert("Please set your location first — allow location access or search for your area.")
            return
        }
          if (!address.pincode.trim()) {                     // 👈 add this
        alert("Please enter your pincode before placing the order.")
        return
    }
        try {
            await axios.post("/api/user/order", {
                userId: userData?._id,
                items: cartData.map(item => (
                    {
                        grocery: item._id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        quantity: item.quantity,
                        image: item.image
                    }
                )),
                totalAmount: finalTotal,
                address: {
                    fullName: address.fullName,
                    mobile: address.mobile,
                    city: address.city,
                    fullAddress: address.fullAddress,
                    pincode: address.pincode,
                    latitude: position[0],
                    longitude: position[1]
                },
                paymentMethod
            })
            router.push("/user/order-success")
        } catch (err) {
            console.log(err)
            alert("Something went wrong placing your order. Please try again.")
        }
    }

    const handleOnlinePayment = async () => {
        if (!position) {
            alert("Please set your location first — allow location access or search for your area.")
            return
        }
         if (!address.pincode.trim()) {                     // 👈 add this
        alert("Please enter your pincode before placing the order.")
        return
    }
        try {
            const result = await axios.post("/api/user/payment", {
                userId: userData?._id,
                items: cartData.map(item => (
                    {
                        grocery: item._id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        quantity: item.quantity,
                        image: item.image
                    }
                )),
                totalAmount: finalTotal,
                address: {
                    fullName: address.fullName,
                    mobile: address.mobile,
                    city: address.city,
                    fullAddress: address.fullAddress,
                    pincode: address.pincode,
                    latitude: position[0],
                    longitude: position[1]
                },
                paymentMethod
            })
            window.location.href = result.data.url

        } catch (err) {
            console.log(err)
            alert("Something went wrong starting the payment. Please try again.")
        }
    }

    useEffect(() => {
        requestLocation()
    }, [])

    // useEffect(() => {
    //     const fetchAddress = async () => {
    //         if (!position) return
    //         try {
    //             const result = await axios.get(
    //                 `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
    //             )
    //             const addr = result.data.address
    //             setAddress(prev => ({
    //                 ...prev,
    //                 city: addr.city || addr.town || addr.village || addr.county || "",
    //                 pincode: addr.postcode || prev.pincode,
    //                 fullAddress: result.data.display_name
    //             }))
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     fetchAddress()
    // }, [position])
    useEffect(() => {
    const fetchAddress = async () => {
        if (!position) return
        try {
            const result = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json&addressdetails=1&zoom=18`
            )
            const addr = result.data.address
            let pincode = addr.postcode || ""
            let city = addr.city || addr.town || addr.village || addr.county || ""
            let fullAddress = result.data.display_name

            if (!pincode) {
                try {
                    const fallback = await axios.get(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position[0]}&longitude=${position[1]}&localityLanguage=en`
                    )
                    pincode = fallback.data.postcode || ""
                } catch (e) {
                    console.log("BigDataCloud error:", e)
                }
            }

            // 3rd fallback: Google Geocoding API
            if (!pincode) {
                try {
                    const googleRes = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position[0]},${position[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
                    )
                    const components = googleRes.data.results?.[0]?.address_components || []
                    const postalComponent = components.find((c: any) => c.types.includes("postal_code"))
                    pincode = postalComponent?.long_name || ""
                } catch (e) {
                    console.log("Google geocode error:", e)
                }
            }

            setAddress(prev => ({
                ...prev,
                city,
                pincode: pincode || prev.pincode,
                fullAddress
            }))
        } catch (err) {
            console.log(err)
        }
    }
    fetchAddress()
}, [position])

    const handleSearchQuery = async () => {
        if (!searchQuery.trim()) return
        try {
            const result = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
            )
            if (result.data.length === 0) {
                alert("No results found")
                return
            }
            const { lat, lon } = result.data[0]
            setPosition([parseFloat(lat), parseFloat(lon)])
            setLocationError("")
        } catch (err) {
            console.log("Search error:", err)
        }
    }

    return (
        <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
            <motion.div
                className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/user/cart')}
            >
                <ArrowLeft size={16} />
                <span>Back to cart</span>
            </motion.div>

            <motion.h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
                Checkout
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="text-gray-700" />
                        Delivery Address
                    </h2>

                    {locationError && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                            {locationError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-600" size={20} />
                            <input
                                type="text"
                                value={address.fullName || ""}
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-600" size={20} />
                            <input
                                type="text"
                                value={address.mobile || ""}
                                onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                placeholder="Mobile"
                            />
                        </div>

                        <div className="relative">
                            <Home className="absolute left-3 top-3 text-gray-600" size={20} />
                            <input
                                type="text"
                                value={address.fullAddress || ""}
                                onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                placeholder="Full Address"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-gray-600" size={20} />
                                <input
                                    type="text"
                                    value={address.city || ""}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                    placeholder="Enter City"
                                />
                            </div>

                            <div className="relative">
                                <Locate className="absolute left-3 top-3 text-gray-600" size={20} />
                                <input
                                    type="text"
                                    value={address.pincode || ""}
                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                                    placeholder="Pin Code"
                                     required    
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                placeholder="Search City or Area...."
                                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchQuery()}
                            />
                            <button
                                onClick={handleSearchQuery}
                                className="bg-gray-600 hover:bg-green-600 transition-all font-medium text-white px-5 rounded-lg"
                            >
                                Search
                            </button>
                        </div>

                        <button
                            onClick={requestLocation}
                            className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-700 rounded-lg py-2 text-sm font-medium hover:bg-green-50 transition-all"
                        >
                            <LocateFixed size={18} />
                            Use My Current Location
                        </button>

                        <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
                            {position ? (
                                <Map position={position} setPosition={setPosition} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-50">
                                    Map will appear once location is set
                                </div>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={requestLocation}
                                className='absolute bottom-4 right-4 bg-gray-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-[999]'
                            >
                                <LocateFixed size={22} />
                            </motion.button>
                        </div>

                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit'
                >
                    <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'> <CreditCard className='text-black-500' /> Payment Method</h2>

                    <div className='space-y-4 mb-6'>
                        <button onClick={() => setPaymentMethod("online")}
                            className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "online" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}>
                            <CreditCardIcon className='text-gray-600' /> <span className='font-medium text-gray-700'>Pay Online (stripe)</span>
                        </button>

                        <button
                            onClick={() => setPaymentMethod("cod")}
                            className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "cod" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}>
                            <Truck className='text-gray-600' /> <span className='font-medium text-gray-700'>Cash On Delivery</span>
                        </button>
                    </div>

                    <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
                        <div className='flex justify-between'>
                            <span>Sub-Total : </span>
                            <span className='font-semibold text-black'>₹ {subTotal}</span>
                        </div>

                        <div className='flex justify-between'>
                            <span>Deliver Fee : </span>
                            <span className='font-semibold text-black'>{deliveryFee}</span>
                        </div>

                        <div className='flex justify-between font-bold text-lg border-t pt-3'>
                            <span>Final Total : </span>
                            <span className='font-semibold text-black'>{finalTotal}</span>
                        </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.93 }} className='w-full mt-6 bg-gray-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold'
                        onClick={() => {
                            if (paymentMethod == "cod") {
                                handleCod()
                            } else {
                                handleOnlinePayment()
                            }
                        }}
                    >
                        {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
                    </motion.button>

                </motion.div>
            </div>
        </div>
    )
}

export default Checkout