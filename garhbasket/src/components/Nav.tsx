// 'use client'

// import React, { useEffect, useRef } from 'react'
// import mongoose from 'mongoose'
// import Link from 'next/link'
// import { Cross, LogOut, Package, Search, ShoppingCartIcon, User, X } from 'lucide-react'
// import Image from 'next/image'
// import { useState } from 'react'
// import { AnimatePresence } from 'motion/react'
// import { motion } from 'framer-motion'
// import { signOut } from 'next-auth/react'
// interface Iuser{
//     _id?:mongoose.Types.ObjectId
//     name:string
//     email:string
//     password:string
//     mobile?:string
//     role:"user" | "deliveryBoy" | "admin"
//     image?:string | null

// }

// function Nav({user}:{user:Iuser}) {
//   const [open,setOpen]=useState(false)
//   const profileDropDown = useRef<HTMLDivElement>(null)
//   const [searchBarOpen,setSearchBarOpen]=useState(false)

//   useEffect(()=>{
//     const handleClickOutside = (e:MouseEvent)=>{
//       if(profileDropDown.current && !profileDropDown.current.contains(e.target as Node)){
//         setOpen(false)

//       }
//     }
//     document.addEventListener("mousedown",handleClickOutside)

//     return()=>document.removeEventListener("mousedown",handleClickOutside)

//   },[])

//   return (
//     <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">

//         <Link href={"/"} className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform">
//         GarhBasket
//         </Link>

//         <form className='hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md'>

//         <Search className="text-gray-500 w-5 h-5 mr-2" />
//         <input type='text' placeholder='Search for products...' className='w-full outline-none text-gray-700 placeholder-gray-400' />

//         </form>

//         <div className='flex items-center gap-3 md:3 md:gap-6 relative'>


//           <div className='bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden' onClick={()=>setSearchBarOpen((prev)=>!prev)}>

//           </div>

//             <Link href={""} className='relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition'>
//             <ShoppingCartIcon className='w-6 h-6'/>
//             <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow'>0</span>

//             </Link>

//             <div className='relative' ref={profileDropDown}>


//             <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform " onClick={()=>setOpen(prev=>!prev)}>
//               {user?.image?<Image src={user.image} alt="user" fill className="object-cover rounded-full"/>:<User/>}
              

//             </div>
//             <AnimatePresence>
//               {open && 
//               <motion.div
//               initial={{opacity:0, y:-10,scale:0.95}}
//               animate={{opacity:1, y:0,scale:1}}
//               transition={{duration:0.6}}
//               className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999"
//               exit={{opacity:0, y:-10,scale:0.95}}
//               >
//                 <div className='flex'>

//                   <div className='w-10 h-10 relative rounded-full bg-green-100 flex items-center justify-center overflow-hidden'>
//                     {user?.image?<Image src={user.image} alt="user" fill className="object-cover rounded-full"/>:<User/>}

//                   </div>

//                   <div>

//                   <div className="text-gray-800 font-semibold">{user.name}</div>
//                   <div className="text-xs text-gray-500 capitalize">{user.role}</div>

//                   </div>
//                 </div>

//                 <Link href={""} className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-semibold">
//                 <Package className="w-5 h-5 text-green-600" onClick={()=> setOpen(false)} />
//                 My Orders
//                 </Link>

//                 <button
//                   className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium"
//                   onClick={() => { setOpen(false); signOut({ callbackUrl: "/login" }) }}  // ✅ move onClick to button, add semicolon
//                 >
//                   <LogOut className="w-5 h-5 text-red-500" />
//                   Log Out
//                 </button>

//               </motion.div> }
//             </AnimatePresence>

//             <AnimatePresence>
//               {searchBarOpen && 
//               <motion.div 
//               initial={{opacity:0, y:-10,scale:0.95}}
//               animate={{opacity:1, y:0,scale:1}}
//               transition={{duration:0.6}}
//               className='fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2'

//               >
//                 <search className='text-gray-500 w-5 h-5 mr-2'/>
//                 <form className='grow'>
//                   <input type="text" placeholder='Search items' className='w-full outline-none text-gray-700'/>
//                 </form>

//                 <button onClick={()=>setSearchBarOpen(false)}>
//                   <X className='text-gray-500 w-5 h-5'/>
//                 </button>
                
//                 </motion.div>}
//             </AnimatePresence>

            
//             </div>

//         </div>
      
//     </div>
//   )
// }

// export default Nav



'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
// import mongoose from 'mongoose'
import Link from 'next/link'
import { Boxes, ClipboardCheck, LogOut, Menu, Package, PlusCircle, Search, ShoppingCartIcon, User, X } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'

interface Iuser {
  // _id?: mongoose.Types.ObjectId
  _id?: string
  name: string
  email: string
  password: string
  mobile?: string
  role: 'user' | 'deliveryBoy' | 'admin'
  image?: string | null
}

function Nav({ user }: { user: Iuser }) {
  const [open, setOpen] = useState(false)
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileDropDown = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [menuOpen, setMenueOpen]=useState(false)
  // const {cartData}=useSelector((state:Rootstate)=>state.cart)
  const {cartData}=useSelector((state:RootState)=>state.cart)
  const [search, setSearch]= useState("")
  const router = useRouter()
  // Close profile dropdown on outside click


  // const handleSearch= (e:FormEvent)=>{
  //   e.preventDefault()
  //   const query= search.trim()
  //   if(!query){
  //     return router.push("/")
  //   }
  //   router.push(`/?q=${encodeURIComponent(query)}`)
  //   setSearch("")
  //   searchBarOpen(false)
  // }

  const handleSearch = (e: FormEvent) => {
  e.preventDefault()
  const query = search.trim()
  if (!query) {
    return router.push("/")
  }
  router.push(`/?q=${encodeURIComponent(query)}`)
  setSearch("")
  setSearchBarOpen(false)   // ✅ correct setter
}


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropDown.current && !profileDropDown.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sideBar=menuOpen?createPortal(
    <AnimatePresence>

      <motion.div
      initial={{x:-100,opacity:0}}
      animate={{x:0,opacity:1}}
      exit={{x:-100}}
      transition={{type:"spring",stiffness:100,damping:14}}

      className='fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-[999] bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white'
      >

        <div className='flex justify-between items-center mb-2'>
          <h1 className='font-extrabold text-2xl tracking-wide text-white/90'>Admin Panel</h1>
          <button className='text-white/80 hover:text-red-400 text-2xl font-bold traansition' onClick={()=>setMenueOpen(false)}>
          <X/>
          </button>
        </div>

        <div className='flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner'>
          <div className='relative w-12 h-12 rounded-full overflow-hidden border-2 border-white-400/60 shadow-lg'>
            {user.image?<Image src={user.image} alt='user' fill className='object-cover ronded-full'/>:<User/>}
          </div>
          <h2 className='tex-lg font-semibold text-white'>{user.name}</h2> 
          <p className='text-xs text-green-200 capitalize tracking-wide'>{user.role}</p>
        </div>

        <div>

        </div>
{/*  */}
        <div className='flex flex-col gap-3 font-medium mt-6'>
          <Link href={"/admin/add-grocery"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'> <PlusCircle className='w-5 h-5'/> ADD Grocery</Link>

          <Link href={"/admin/view-grocery"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'> <Boxes className='w-5 h-5'/> View Grocery </Link>

          <Link href={"/admin/manage-orders"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'> <ClipboardCheck className='w-5 h-5'/> Manage Orders</Link>


        </div>

        <div className='my-5 border-t border-white/20'></div>

        <div className='flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all' onClick={async()=>await signOut({callbackUrl:"/"})}>
          <LogOut className='w-5 h-5 text-white-300'/>Logout
        </div>

      </motion.div>

    </AnimatePresence>,document.body
  ):null



  // Auto-focus search input when opened
  useEffect(() => {
    if (searchBarOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 300)
    }
  }, [searchBarOpen])

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-600',
    deliveryBoy: 'bg-blue-100 text-blue-600',
    user: 'bg-green-100 text-green-600',
  }

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-2xl shadow-2xl shadow-green-900/30 backdrop-blur-md flex justify-between items-center h-[68px] px-4 md:px-7 gap-3">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <span className="text-white font-extrabold text-xl sm:text-2xl tracking-tight hidden sm:block">
              GharBasket
            </span>
          </Link>
          {user.role=="user" && <form
            // onSubmit={(e) => e.preventDefault()}
            className="hidden md:flex items-center bg-white rounded-xl px-4 py-2 w-1/2 max-w-md shadow-md focus-within:shadow-lg border border-transparent focus-within:border-green-200 transition-all duration-300 group" onSubmit={handleSearch}
          >
            <Search className="text-green-500 w-4 h-4 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}

            />
          </form>}

          {/* Desktop Search */}
          

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Mobile Search Toggle */}

            {user.role=="user" && <><motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className="md:hidden bg-white/15 hover:bg-white/25 border border-white/20 rounded-full w-10 h-10 flex items-center justify-center text-white transition"
              onClick={() => setSearchBarOpen((prev) => !prev)}
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* Cart */}
            <motion.div whileTap={{ scale: 0.92 }}>
              <Link
                href="/user/cart"
                className="relative bg-white/15 hover:bg-white/25 border border-white/20 rounded-full w-10 h-10 flex items-center justify-center text-white transition"
                aria-label="Cart"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                  {cartData.length}
                </span>
              </Link>
            </motion.div> </>}

            {user.role=="admin" && <>
            <div className='hidden md:flex items-center gap-4'>
              <Link href={"admin/add-grocery"} className='flex items-center gap-2 bg-white text-white-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>Add Grocery <PlusCircle className='w-5 h-5'/></Link>

              <Link href={"/admin/view-grocery"} className='flex items-center gap-2 bg-white text-white-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>View Grocery <Boxes className='w-5 h-5'/></Link>

              <Link href={"/admin/manage-orders"}className='flex items-center gap-2 bg-white text-white-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>Manage Order <ClipboardCheck className='w-5 h-5'/> </Link>

            </div>

            <div className='md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md' onClick={()=>setMenueOpen(prev=>!prev)}>
              <Menu  className='text-green-600 w-6 h-6'/>
            </div>
            </>}
            

            {/* Profile */}
            <div className="relative" ref={profileDropDown}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-full pl-1 pr-3 h-10 transition"
                aria-label="Profile menu"
              >
                {/* Avatar */}
                <div className="relative w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-white/20 shrink-0">
                  {user?.image
                    ? <Image src={user.image} alt="user" fill className="object-cover" />
                    : <User className="w-4 h-4 text-white" />
                  }
                </div>
                {/* First name only, hidden on very small screens */}
                <span className="hidden sm:block text-white font-semibold text-sm max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]"
                  >
                    {/* User Info Header */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 relative rounded-full bg-green-100 flex items-center justify-center overflow-hidden ring-2 ring-green-200 shrink-0">
                          {user?.image
                            ? <Image src={user.image} alt="user" fill className="object-cover" />
                            : <User className="w-5 h-5 text-green-600" />
                          }
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-gray-900 font-bold text-sm truncate">{user.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user.email}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize ${roleColors[user.role] ?? 'bg-gray-100 text-gray-500'}`}>
                            {user.role === 'deliveryBoy' ? 'Delivery Boy' : user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}


                    <div className="p-2">

                      {user.role=="user" &&  <Link
                        href="/user/my-order"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-xl text-gray-700 text-sm font-medium transition group"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        My Orders
                      </Link>}
                     

                      <button
                        type="button"
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-red-50 rounded-xl text-gray-700 text-sm font-medium transition group mt-1"
                        onClick={() => { setOpen(false); signOut({ callbackUrl: '/login' }) }}
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition">
                          <LogOut className="w-4 h-4 text-red-500" />
                        </div>
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Search Bar ── */}
      <AnimatePresence>
        {searchBarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSearchBarOpen(false)}
            />

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[88px] left-1/2 -translate-x-1/2 w-[92%] z-50 md:hidden"
            >
              <form
                // onSubmit={(e) => e.preventDefault()}
                onSubmit={handleSearch}
                className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/15 px-4 py-3 gap-3 border border-gray-100"
              >
                <Search className="text-green-500 w-5 h-5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for groceries..."
                  className="grow outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                  value={search}
              onChange={(e)=>setSearch(e.target.value)}
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                <div className="w-px h-5 bg-gray-200" />
                <button
                  type="button"
                  onClick={() => { setSearchBarOpen(false); setSearchQuery('') }}
                  className="text-gray-400 hover:text-gray-700 transition shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {sideBar}
    </>
    
    
  )
}

export default Nav