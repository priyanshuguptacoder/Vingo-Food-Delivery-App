import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaMapMarkerAlt, FaCheck, FaBoxOpen } from 'react-icons/fa'

function DeliveryBoy() {
  const {userData,socket}=useSelector(state=>state.user)
  const [currentOrder,setCurrentOrder]=useState()
  const [showOtpBox,setShowOtpBox]=useState(false)
  const [availableAssignments,setAvailableAssignments]=useState(null)
  const [otp,setOtp]=useState("")
  const [todayDeliveries,setTodayDeliveries]=useState([])
  const [deliveryBoyLocation,setDeliveryBoyLocation]=useState(null)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState("")

  useEffect(()=>{
    if(!socket || userData.role!=="deliveryBoy") return
    let watchId
    if(navigator.geolocation){
      watchId=navigator.geolocation.watchPosition((position)=>{
          const latitude=position.coords.latitude
          const longitude=position.coords.longitude
          setDeliveryBoyLocation({lat:latitude,lon:longitude})
          socket.emit('updateLocation',{
            latitude,
            longitude,
            userId:userData._id
          })
        },
        (error)=>{
          console.log(error)
        },
        {
          enableHighAccuracy:true
        }
      )
    }

    return ()=>{
      if(watchId) navigator.geolocation.clearWatch(watchId)
    }
  },[socket,userData])

  const ratePerDelivery=50
  const totalEarning=todayDeliveries.reduce((sum,d)=>sum + d.count*ratePerDelivery,0)

  const getAssignments=async () => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder=async () => {
     try {
      const result=await axios.get(`${serverUrl}/api/order/get-current-order`,{withCredentials:true})
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder=async (assignmentId) => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
      console.log(result.data)
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!socket) return

    const handleNewAssignment = (data) => {
        setAvailableAssignments(prev =>
            prev ? [...prev, data] : [data]
        )
    }

    socket.on("newAssignment", handleNewAssignment)

    return () => {
        socket.off("newAssignment", handleNewAssignment)
    }
  }, [socket])
  
  const sendOtp=async () => {
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/order/send-delivery-otp`,{
        orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id
      },{withCredentials:true})
      setLoading(false)
      setShowOtpBox(true)
      console.log(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    try {
        const result = await axios.post(
            `${serverUrl}/api/order/verify-delivery-otp`,
            {
                orderId: currentOrder._id,
                shopOrderId: currentOrder.shopOrder._id,
                otp
            },
            {
                withCredentials: true
            }
        )
        console.log(result.data)
        setMessage(result.data.message)
        setCurrentOrder(null)
        setShowOtpBox(false)
        setOtp("")
        await getAssignments()
        await handleTodayDeliveries()
    } catch (error) {
        console.log(
            "VERIFY OTP ERROR:",
            error.response?.data || error.message
        )
    }
  }

  const handleTodayDeliveries=async () => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/get-today-deliveries`,{withCredentials:true})
      console.log(result.data)
      setTodayDeliveries(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  },[userData])

  return (
    <div className='w-full flex flex-col gap-8 items-center pb-20'>
      <Nav/>
      <div className='w-full max-w-4xl flex flex-col gap-6 items-center px-4 mt-6'>
        
        {/* Welcome Card */}
        <div className='bg-white rounded-3xl shadow-sm p-8 flex flex-col justify-start items-center w-full border border-gray-100 text-center gap-3'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Welcome, <span className='text-[#ff4d2d]'>{userData.fullName}</span></h1>
          <p className='text-gray-500 font-medium flex items-center gap-2'>
            <FaMapMarkerAlt className="text-[#ff4d2d]" />
            Location: <span className='text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200'>{deliveryBoyLocation ? `${deliveryBoyLocation.lat.toFixed(4)}, ${deliveryBoyLocation.lon.toFixed(4)}` : "Fetching..."}</span>
          </p>
        </div>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Earnings Card */}
          <div className='bg-white rounded-3xl shadow-sm p-8 w-full border border-gray-100 flex flex-col items-center justify-center text-center'>
            <div className='w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500 text-2xl'>₹</div>
            <h2 className='text-lg font-bold text-gray-600 mb-1'>Today's Earnings</h2>
            <span className='text-5xl font-black text-gray-900 tracking-tight'>₹{totalEarning}</span>
          </div>

          {/* Chart Card */}
          <div className='bg-white rounded-3xl shadow-sm p-6 w-full border border-gray-100'>
            <h2 className='text-lg font-bold mb-4 text-gray-800'>Deliveries Today</h2>
            {todayDeliveries.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={todayDeliveries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tickFormatter={(h)=>`${h}:00`} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value)=>[value,"Deliveries"]} labelFormatter={label=>`${label}:00`} cursor={{fill: '#fff9f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill='#ff4d2d' radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-[160px] flex items-center justify-center text-gray-400 font-medium italic bg-gray-50 rounded-xl border border-dashed border-gray-200'>No deliveries yet today</div>
            )}
          </div>
        </div>

        {/* Available Orders */}
        {!currentOrder && (
          <div className='bg-white rounded-3xl p-8 shadow-sm w-full border border-gray-100 mt-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 bg-orange-50 rounded-xl text-[#ff4d2d]'>
                <FaBoxOpen size={20} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Available Orders</h2>
            </div>

            <div className='space-y-4'>
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a,index)=>(
                  <div className='border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#ff4d2d]/30 hover:shadow-sm transition-all' key={index}>
                    <div className='flex-1'>
                      <p className='text-lg font-bold text-gray-900 mb-1'>{a?.shopName}</p>
                      <p className='text-sm text-gray-600 mb-2 leading-relaxed'><span className='font-semibold text-gray-800'>Deliver to:</span> {a?.deliveryAddress.text}</p>
                      <div className='flex items-center gap-3'>
                        <span className='px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md'>{a.items.length} items</span>
                        <span className='px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md'>₹{a.subtotal}</span>
                      </div>
                    </div>
                    <button className='w-full md:w-auto bg-[#ff4d2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e64323] hover:shadow-md active:scale-95 transition-all' onClick={()=>acceptOrder(a.assignmentId)}>Accept Delivery</button>
                  </div>
                ))
              ) : (
                <div className='text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
                  <p className='text-gray-500 font-medium'>No available orders at the moment. Waiting for new assignments...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Order */}
        {currentOrder && (
          <div className='bg-white rounded-3xl p-8 shadow-md w-full border border-orange-100 mt-2'>
            <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
              <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                <span className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></span>
                Active Delivery
              </h2>
              <span className='bg-orange-50 text-[#ff4d2d] px-3 py-1 rounded-full text-sm font-bold border border-orange-100'>In Progress</span>
            </div>
            
            <div className='bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 flex flex-col gap-1'>
              <p className='font-bold text-xl text-gray-900'>{currentOrder?.shopOrder.shop.name}</p>
              <p className='text-sm text-gray-600 leading-relaxed max-w-2xl'><span className='font-semibold text-gray-800'>Drop-off:</span> {currentOrder.deliveryAddress.text}</p>
              <div className='flex items-center gap-3 mt-2'>
                <span className='px-2.5 py-1 bg-white text-gray-600 text-xs font-bold rounded-md border border-gray-200 shadow-sm'>{currentOrder.shopOrder.shopOrderItems.length} items</span>
                <span className='px-2.5 py-1 bg-white text-green-700 text-xs font-bold rounded-md border border-gray-200 shadow-sm'>₹{currentOrder.shopOrder.subtotal}</span>
              </div>
            </div>

            <div className='mb-6 rounded-2xl overflow-hidden border border-gray-200'>
              <DeliveryBoyTracking data={{ 
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location.coordinates[1],
                  lon: userData.location.coordinates[0]
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude
                }
              }} />
            </div>

            {!showOtpBox ? (
              <button className='w-full bg-[#10b981] text-white font-bold py-4 rounded-xl shadow-md shadow-green-200 hover:bg-[#059669] active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-lg cursor-pointer' onClick={sendOtp} disabled={loading}>
                {loading ? <ClipLoader size={24} color='white'/> : <><FaCheck /> Mark As Delivered</>}
              </button>
            ) : (
              <div className='p-6 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm'>
                <p className='text-sm font-medium text-gray-700 mb-3 text-center'>Enter the OTP sent to <span className='font-bold text-gray-900'>{currentOrder.user.fullName}</span> to confirm delivery</p>
                <input type="text" className='w-full border border-gray-300 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] text-center text-xl font-bold tracking-widest text-gray-800 bg-white shadow-sm' placeholder='_ _ _ _' maxLength={4} onChange={(e)=>setOtp(e.target.value)} value={otp}/>
                
                {message && <div className='mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-semibold text-sm flex items-center justify-center gap-2'><FaCheck /> {message}</div>}

                <button className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] active:scale-[0.98] transition-all text-lg cursor-pointer disabled:opacity-70" onClick={verifyOtp} disabled={otp.length < 4}>
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoy
