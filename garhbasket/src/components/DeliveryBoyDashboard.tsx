


"use client";

import { getSocket } from "@/lib/socket";

// import { ILocation } from "@/models/...";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import DeliveryChat from "./DeliveryChat";
import { BarChart2, Loader, RefreshCw, Truck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ILocation } from "@/models/location"
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

function DeliveryBoyDashboard({earning}:{earning:number}) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { data: session } = useSession();
  // const { userData } = useSelector((state: Rootstate) => state.user);
  // const { userData } = useSelector((state: Rootstate) => state.user);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOtpBox,setShowOtpBox]= useState(false)
  const [otp,setOtp]=useState("")
  const [otpError,setOtpError]= useState("")
  const [sendOtpLoading, setSendOtpLoading]=useState(false)
  const [verifyOtpLoading,setVerifyOtpLoading]= useState(false)
  const [userLocation, setUserLocation] = useState<ILocation>({
    lat: 0,
    lng: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    lat: 0,
    lng: 0,
  });

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      console.log(result);
      setAssignments(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          lat: result.data.assignment.order.address.latitude,
          lng: result.data.assignment.order.address.longitude,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Watch delivery boy's live location and emit it via socket
  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setDeliveryBoyLocation({
          lat: lat,
          lng: lon,
        });

        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  // ✅ Identity emit
  useEffect(() => {
    const socket = getSocket();
    const userId = session?.user?.id;

    if (!userId) return;

    if (socket.connected) {
      socket.emit("identity", userId);
    } else {
      socket.on("connect", () => {
        socket.emit("identity", userId);
      });
    }
  }, [session]);

  // ✅ Socket events
  useEffect(() => {
    const socket = getSocket();

    socket.off("new-assignment");
    socket.off("clear-assignments");
    socket.off("remove-assignment");

    socket.on("new-assignment", (deliveryAssignment) => {
      console.log("✅ new-assignment received:", deliveryAssignment);
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });

    socket.on("clear-assignments", () => {
      console.log("🧹 clearing all assignments");
      setAssignments([]);
    });

    socket.on("remove-assignment", ({ assignmentId }: { assignmentId: string }) => {
      console.log("🗑️ removing assignment:", assignmentId);
      setAssignments((prev) =>
        prev.filter((a) => String(a._id) !== String(assignmentId))
      );
    });

    return () => {
      socket.off("new-assignment");
      socket.off("clear-assignments");
      socket.off("remove-assignment");
    };
  }, []);

  useEffect(():any=>{
    const socket = getSocket()
    socket.on("update-deliveryBoy-location",({userId,location})=>{
      setDeliveryBoyLocation({
        lat:location.coordinates[1],
        lng:location.coordinates[0]
      })
    })
    return()=>socket.off("update-deliveryBoy-location")
  },[])

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  const sendOtp = async ()=>{
    setSendOtpLoading(true)
    try{
      const result = await axios.post("api/delivery/otp/send",{orderId:activeOrder.order._id})
      console.log(result.data)
      setShowOtpBox(true)
      setSendOtpLoading(false)
    }catch(err){
      console.log(err)
      setSendOtpLoading(false)

    }
  }

  const verifyOtp = async ()=>{
    setVerifyOtpLoading(true)
    try{
      const result = await axios.post ("/api/delivery/otp/verify",{orderId:activeOrder.order._id,otp})
      console.log(result.data)
      setActiveOrder(null)
      setVerifyOtpLoading(false)
      await fetchCurrentOrder()
      window.location.reload()
    }catch(err){
      // console.log(err)
      setOtpError("Otp verification Error")
      setVerifyOtpLoading(false)
      await fetchCurrentOrder()
    }
  }

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.post(`/api/delivery/assignment/${id}/accept-assignment`);
      // console.log(result);
      fetchCurrentOrder()
      setAssignments([]);
    } catch (err: any) {
      console.log(err);
      console.log("❌ full error:", err?.response?.data);
      alert(JSON.stringify(err?.response?.data));
    }
  };

  // if(!activeOrder && assignments.length===0){
  //   const todayEarning =  [
  //     {name :"Today",
  //       earning,
  //       deliveries:earning/40

  //     }
  //   ]
  //   return(
  //     <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
  //       <div className="max-w-md w-full text-center">
  //         <h2 className="text-2xl font-bold text-gray-800">No Active Deliveries 🚚</h2>
  //         <p className="text-gray-500 mb-5"> Stay Online to receive new Orders</p>

  //         <div className="bg-white border rounded-xl shadow-xl p-6">
  //           <h2 className="font-medium text-blue-700 mb-2 ">Todays Performance</h2>

  //           <ResponsiveContainer width="100%" height={300}>
  //                     <BarChart data={todayEarning}>
  //                       <XAxis dataKey="name"/>
  //                       <YAxis/>
  //                       <Tooltip/>
  //                       <Legend/>

  //                       <Bar dataKey="earning" name = "Earning (Rs.)" />
  //                       <Bar dataKey="deliveries" name="Deliveries"/>
  //                     </BarChart>
  //                   </ResponsiveContainer>
  //                   <p className="mt-4 text-lg font-bold text-gray-700">{earning || 0} Earned today</p>
  //                   <button
  //                        className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg"
  //                       onClick={() => window.location.reload()}
  //                     >
  //                       Refresh
  //                     </button>
  //         </div>




  //       </div>
 

  //     </div>
  //   )
  // }

  if (!activeOrder && assignments.length === 0) {
  const todayEarning = [
    {
      name: "Today",
      earning,
      deliveries: earning / 40,
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Truck className="text-green-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Active Deliveries</h2>
          <p className="text-gray-500 mt-1">Stay online to receive new orders</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Earned Today</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">₹{earning || 0}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Deliveries</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{Math.round(earning / 40) || 0}</p>
          </div>
        </div>

        {/* Chart card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-700">Today's Performance</h3>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={todayEarning}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="earning" name="Earning (₹)" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="deliveries" name="Deliveries" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <button
            className="mt-5 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all text-white py-3 rounded-xl font-medium"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-[120px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">Active Delivery</h1>
          <p>order# {activeOrder.order._id.slice(-6)}</p>

          <div className="rounded-xl border shadow-lg overflow-hidden">
            {/* <LiveMap userLocation={userLocation} 
            deliveryBoyLoaction={deliveryBoyLocation} /> */}

            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>

            {/* <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id?.toString()!}/> */}
            <DeliveryChat 
    orderId={activeOrder.order._id} 
    deliveryBoyId={userData?._id?.toString()!}
    disabled={activeOrder.order.deliveryOtpVerification === true}
/>
            {/* {userData?._id && (
     <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData._id.toString()} />
   )} */}

            <div className="mt-6 bg-white rounded-xl border shadow p-6">

             {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button 
              onClick={sendOtp}
              className="w-full py-4 bg-gray-600 text-white text-center rounded-lg cursor-pointer">
                {sendOtpLoading?<Loader className="animate-spin text-white text-center" size={16}/>:"Mark as Delivered "}
                
              </button>)}

              {
                showOtpBox && 
                <div className="mt-4">
                  <input type="text" className="w-full py-3 border rounded-lg text-center" placeholder="Enter Otp" maxLength={4} onChange={(e)=>setOtp(e.target.value)} value={otp} />

                  <button className="w-full mt-4 bg-blue-600 text-center text-white py-3 rounded-lg" onClick={verifyOtp}>{verifyOtpLoading?<Loader className="animate-spin text-white text-center" size={16}/>:"Verify OTP"}</button>
                  {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
                </div>

              }

              {
                activeOrder.order.deliveryOtpVerification && <div className="text-green-700 text-center">
                  Delivery Completed
                </div>
              }



            </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 pt-25">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Delivery Assignments</h2>
        {assignments.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No pending assignments</p>
        )}
        {assignments.map((a,index) => (
          <div key={index} className="p-5 bg-white rounded-xl shadow mb-4 border">
            <p>
              <b>Order Id</b> #{a?.order?._id?.toString().slice(-6)}
            </p>
            <p className="text-gray-600">{a?.order?.address?.fullAddress}</p>
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                onClick={() => handleAccept(a._id)}
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;