import axios from 'axios';
import React from 'react'
import { MdPhone } from "react-icons/md";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { getFoodImage } from '../utils/imageMapping';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()
    
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials:true})
            dispatch(updateOrderStatus({orderId, shopId, status}))
            setAvailableBoys(result.data.availableBoys)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'out for delivery':
            case 'out of delivery': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-4'>
                <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#ff4d2d] text-xl font-bold shrink-0'>
                        {data.user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className='text-lg font-bold text-gray-900'>{data.user.fullName}</h2>
                        <p className='text-sm text-gray-500 font-medium'>{data.user.email}</p>
                        <p className='flex items-center gap-1.5 text-sm text-gray-600 mt-1 font-medium'>
                            <MdPhone className='text-gray-400' />
                            {data.user.mobile}
                        </p>
                    </div>
                </div>
                
                <div className='text-left sm:text-right bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto'>
                    <p className='text-sm text-gray-600 font-medium'>
                        Payment: <span className='text-gray-900 font-bold uppercase'>{data.paymentMethod}</span>
                    </p>
                    {data.paymentMethod === "online" && <p className='text-xs text-gray-500'>Status: {data.payment ? "Paid" : "Pending"}</p>}
                </div>
            </div>

            <div className='flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl'>
                <IoLocationOutline className='text-gray-400 mt-0.5 shrink-0' size={18} />
                <div>
                    <p className='font-medium text-gray-800'>{data?.deliveryAddress?.text}</p>
                    <p className='text-xs text-gray-500 mt-1'>Lat: {data?.deliveryAddress?.latitude?.toFixed(4)}, Lon: {data?.deliveryAddress?.longitude?.toFixed(4)}</p>
                </div>
            </div>

            <div className='space-y-3'>
                <h3 className='font-bold text-gray-900'>Order Items</h3>
                <div className='flex space-x-4 overflow-x-auto pb-2 custom-scrollbar'>
                    {data.shopOrders.shopOrderItems.map((item, index) => (
                        <div key={index} className='flex-shrink-0 w-[160px] border border-gray-100 rounded-xl p-3 bg-white shadow-sm flex flex-col'>
                            <div className='w-full h-24 rounded-lg overflow-hidden mb-3 bg-gray-50'>
                                <img src={item.item.image && (item.item.image.startsWith('data:image/svg+xml') || item.item.image.includes('<svg')) ? getFoodImage(item.name) : (item.item.image || getFoodImage(item.name))} alt={item.name} className='w-full h-full object-cover hover:scale-105 transition-transform' />
                            </div>
                            <p className='text-sm font-bold text-gray-900 truncate capitalize' title={item.name}>{item.name}</p>
                            
                            <div className='mt-auto pt-2 flex items-center justify-between'>
                                <p className='text-xs font-medium text-gray-500'>Qty: {item.quantity}</p>
                                <span className='font-bold text-gray-900 text-sm'>₹{item.price * item.quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-4'>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(data.shopOrders.status)}`}>
                        {data.shopOrders.status}
                    </span>
                    
                    <select className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] bg-gray-50 cursor-pointer shadow-sm' onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                        <option value="">Update Status</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out of delivery">Out For Delivery</option>
                    </select>
                </div>
                
                <div className='text-left sm:text-right w-full sm:w-auto'>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-1'>Subtotal</p>
                    <p className='font-black text-2xl text-[#ff4d2d]'>₹{data.shopOrders.subtotal}</p>
                </div>
            </div>

            {data.shopOrders.status === "out of delivery" && (
                <div className="mt-2 p-4 border border-blue-100 rounded-2xl bg-blue-50/50">
                    <p className='font-bold text-blue-900 text-sm mb-2'>
                        {data.shopOrders.assignedDeliveryBoy ? "Assigned Delivery Partner" : "Available Delivery Partners"}
                    </p>
                    
                    {availableBoys?.length > 0 ? (
                        <div className='space-y-2'>
                            {availableBoys.map((b, index) => (
                                <div key={index} className='flex items-center gap-2 text-sm font-medium text-blue-800 bg-white p-2 rounded-lg border border-blue-100 shadow-sm'>
                                    <MdPhone className='text-blue-400' />
                                    {b.fullName} - {b.mobile}
                                </div>
                            ))}
                        </div>
                    ) : data.shopOrders.assignedDeliveryBoy ? (
                        <div className='flex items-center gap-2 text-sm font-medium text-blue-800 bg-white p-3 rounded-xl border border-blue-100 shadow-sm'>
                            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold'>
                                {data.shopOrders.assignedDeliveryBoy.fullName.charAt(0)}
                            </div>
                            <div>
                                <p>{data.shopOrders.assignedDeliveryBoy.fullName}</p>
                                <p className='text-xs text-blue-600 flex items-center gap-1'><MdPhone /> {data.shopOrders.assignedDeliveryBoy.mobile}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2 text-sm text-blue-600 italic bg-white p-3 rounded-xl border border-blue-100 border-dashed'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                            Waiting for a delivery partner to accept...
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default OwnerOrderCard
