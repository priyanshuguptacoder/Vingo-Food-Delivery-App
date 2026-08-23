import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaStar } from 'react-icons/fa'
import { IoLocationOutline } from "react-icons/io5";
import { TbReceipt } from "react-icons/tb";

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})//itemId:rating

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'out for delivery': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#ff4d2d]'>
                        <TbReceipt size={24} />
                    </div>
                    <div>
                        <p className='font-bold text-gray-900 text-lg'>
                            Order <span className='text-[#ff4d2d] uppercase tracking-wider'>#{data._id.slice(-6)}</span>
                        </p>
                        <p className='text-sm text-gray-500 font-medium'>
                            {formatDate(data.createdAt)}
                        </p>
                    </div>
                </div>
                <div className='text-left sm:text-right w-full sm:w-auto bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl'>
                    <p className='text-sm text-gray-600 font-medium'>
                        Payment: <span className='text-gray-900 font-bold uppercase'>{data.paymentMethod}</span>
                    </p>
                    {data.paymentMethod !== "cod" && <p className='text-xs text-gray-500'>Status: {data.payment ? "Paid" : "Pending"}</p>}
                </div>
            </div>

            <div className='space-y-4'>
                {data.shopOrders.map((shopOrder, index) => (
                    <div className='border border-gray-100 rounded-2xl p-5 bg-gray-50/50 space-y-4' key={index}>
                        <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
                            <h3 className='font-bold text-gray-900 text-lg capitalize'>{shopOrder.shop.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(shopOrder.status)}`}>
                                {shopOrder.status}
                            </span>
                        </div>

                        <div className='flex space-x-4 overflow-x-auto pb-2 custom-scrollbar'>
                            {shopOrder.shopOrderItems.map((item, idx) => (
                                <div key={idx} className='flex-shrink-0 w-[180px] border border-gray-100 rounded-xl p-3 bg-white shadow-sm flex flex-col'>
                                    <div className='w-full h-28 rounded-lg overflow-hidden mb-3 bg-gray-50'>
                                        <img src={item.item.image} alt={item.name} className='w-full h-full object-cover hover:scale-105 transition-transform' />
                                    </div>
                                    <p className='text-sm font-bold text-gray-900 truncate capitalize' title={item.name}>{item.name}</p>
                                    <p className='text-xs font-medium text-gray-500 mt-1 mb-2'>Qty: {item.quantity} × ₹{item.price}</p>
                                    
                                    <div className='mt-auto pt-2 border-t border-gray-100 flex items-center justify-between'>
                                        <span className='font-bold text-gray-900'>₹{item.quantity * item.price}</span>
                                    </div>

                                    {shopOrder.status === "delivered" && (
                                        <div className='flex space-x-1 mt-3 justify-center'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} className={`text-lg cursor-pointer transition-transform hover:scale-110 ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-gray-200'}`} onClick={() => handleRating(item.item._id, star)}>
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className='flex justify-between items-center pt-2'>
                            <p className='text-sm text-gray-600 font-medium'>Shop Subtotal</p>
                            <p className='font-bold text-gray-900'>₹{shopOrder.subtotal}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-100 pt-6 gap-4'>
                <div className='flex items-center gap-2'>
                    <div className='text-gray-500'>
                        <IoLocationOutline size={20} />
                    </div>
                    <p className='text-sm text-gray-600 font-medium truncate max-w-xs' title={data.deliveryAddress.text}>
                        {data.deliveryAddress.text}
                    </p>
                </div>
                
                <div className='flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end'>
                    <div className='text-right'>
                        <p className='text-xs text-gray-500 font-medium uppercase tracking-wider mb-1'>Order Total</p>
                        <p className='font-black text-2xl text-[#ff4d2d]'>₹{data.totalAmount}</p>
                    </div>
                    {data.shopOrders?.[0].status !== 'delivered' && data.shopOrders?.[0].status !== 'cancelled' && (
                        <button className='bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer' onClick={() => navigate(`/track-order/${data._id}`)}>
                            Track Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserOrderCard
