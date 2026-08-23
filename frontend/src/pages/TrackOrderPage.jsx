import axios from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
import { MdPhone } from "react-icons/md";
import { FaStore } from "react-icons/fa6";

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState() 
    const navigate = useNavigate()
    const {socket} = useSelector(state => state.user)
    const [liveLocations, setLiveLocations] = useState({})
    
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket?.on('updateDeliveryLocation', ({deliveryBoyId, latitude, longitude}) => {
            setLiveLocations(prev => ({
                ...prev,
                [deliveryBoyId]: {lat: latitude, lon: longitude}
            }))
        })
        
        return () => {
            socket?.off('updateDeliveryLocation')
        }
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'preparing': return 'bg-orange-100 text-orange-800'
            case 'out for delivery':
            case 'out of delivery': return 'bg-blue-100 text-blue-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className='min-h-screen bg-[#fff9f6] py-6 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto flex flex-col gap-8'>
                
                <div className='flex items-center gap-4 mb-2 sticky top-0 bg-[#fff9f6]/90 backdrop-blur py-4 z-10 border-b border-[#ff4d2d]/10'>
                    <div className='cursor-pointer p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d]' onClick={() => navigate(-1)}>
                        <IoIosArrowRoundBack size={32} />
                    </div>
                    <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Track Order</h1>
                    {currentOrder && (
                        <span className='ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold border border-gray-200'>
                            #{currentOrder._id.slice(-6)}
                        </span>
                    )}
                </div>

                <div className='flex flex-col gap-8 pb-20'>
                    {currentOrder?.shopOrders?.map((shopOrder, index) => (
                        <div className='bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6' key={index}>
                            <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-6'>
                                <div>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff4d2d]'>
                                            <FaStore size={18} />
                                        </div>
                                        <p className='text-xl font-bold text-gray-900'>{shopOrder.shop.name}</p>
                                    </div>
                                    <p className='text-gray-600 font-medium ml-13'><span className='text-gray-400'>Items:</span> {shopOrder.shopOrderItems?.map(i => i.name).join(", ")}</p>
                                    <p className='text-gray-900 font-bold ml-13 mt-1'><span className='text-gray-400 font-medium'>Subtotal:</span> ₹{shopOrder.subtotal}</p>
                                </div>
                                
                                <div className='flex flex-col items-start md:items-end gap-2'>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${getStatusColor(shopOrder.status)}`}>
                                        {shopOrder.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100'>
                                <p className='text-sm text-gray-500 font-bold uppercase tracking-wider mb-2'>Delivery Address</p>
                                <p className='text-gray-800 font-medium'>{currentOrder.deliveryAddress?.text}</p>
                            </div>

                            {shopOrder.status !== "delivered" && shopOrder.status !== "cancelled" ? (
                                <div className='bg-blue-50/50 border border-blue-100 rounded-2xl p-5'>
                                    {shopOrder.assignedDeliveryBoy ? (
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl'>
                                                {shopOrder.assignedDeliveryBoy.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className='text-xs text-blue-500 font-bold uppercase tracking-wider mb-0.5'>Delivery Partner</p>
                                                <p className='font-bold text-blue-900'>{shopOrder.assignedDeliveryBoy.fullName}</p>
                                                <p className='text-sm font-medium text-blue-700 flex items-center gap-1 mt-0.5'>
                                                    <MdPhone size={14}/> {shopOrder.assignedDeliveryBoy.mobile}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                                                <div className='w-4 h-4 bg-orange-500 rounded-full animate-pulse'></div>
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-900'>Assigning Partner</p>
                                                <p className='text-sm text-gray-500 font-medium'>Waiting for a delivery partner to accept your order...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : shopOrder.status === "delivered" && (
                                <div className='bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center justify-center'>
                                    <p className='text-green-600 font-bold text-lg flex items-center gap-2'>
                                        <span className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>✓</span>
                                        Order Delivered Successfully
                                    </p>
                                </div>
                            )}

                            {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered" && shopOrder.status !== "cancelled") && (
                                <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
                                    <DeliveryBoyTracking data={{
                                        deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                            lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                            lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                        },
                                        customerLocation: {
                                            lat: currentOrder.deliveryAddress.latitude,
                                            lon: currentOrder.deliveryAddress.longitude
                                        }
                                    }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrackOrderPage
