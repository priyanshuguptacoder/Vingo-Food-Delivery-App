import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data }) {
    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)
    
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                (i <= rating) ? (
                    <FaStar key={i} className='text-yellow-400 text-sm' />
                ) : (
                    <FaRegStar key={i} className='text-gray-300 text-sm' />
                )
            )
        }
        return stars
    }

    const handleIncrease = () => {
        setQuantity(prev => prev + 1)
    }
    
    const handleDecrease = () => {
        if (quantity > 0) {
            setQuantity(prev => prev - 1)
        }
    }

    return (
        <div className='w-[260px] rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group'>
            <div className='relative w-full h-[180px] overflow-hidden bg-gray-50'>
                <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm z-10'>
                    {data.foodType === "veg" ? <FaLeaf className='text-green-600 text-sm' /> : <FaDrumstickBite className='text-red-600 text-sm' />}
                </div>

                <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
            </div>

            <div className="flex-1 flex flex-col p-4">
                <h3 className='font-bold text-gray-900 text-lg truncate mb-1 capitalize' title={data.name}>{data.name}</h3>

                <div className='flex items-center gap-1.5'>
                    <div className='flex items-center'>
                        {renderStars(data.rating?.average || 0)}
                    </div>
                    <span className='text-xs font-medium text-gray-500'>
                        ({data.rating?.count || 0})
                    </span>
                </div>
            </div>

            <div className='flex items-center justify-between p-4 pt-0 mt-auto'>
                <span className='font-extrabold text-gray-900 text-xl tracking-tight'>
                    ₹{data.price}
                </span>

                <div className='flex items-center bg-gray-50 rounded-full border border-gray-200 p-0.5 shadow-sm'>
                    <button className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-50' onClick={handleDecrease} disabled={quantity === 0}>
                        <FaMinus size={10} />
                    </button>
                    <span className='w-6 text-center font-semibold text-sm text-gray-800'>{quantity}</span>
                    <button className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all' onClick={handleIncrease}>
                        <FaPlus size={10} />
                    </button>
                    <button className={`ml-1 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${cartItems.some(i => i.id === data._id) ? "bg-gray-800 text-white shadow-md hover:bg-gray-900" : "bg-[#ff4d2d] text-white shadow-md hover:bg-[#e64323] hover:scale-105 disabled:bg-gray-300 disabled:shadow-none disabled:scale-100"}`} onClick={() => {
                        if (quantity > 0) {
                            dispatch(addToCart({
                                id: data._id,
                                name: data.name,
                                price: data.price,
                                image: data.image,
                                shop: data.shop,
                                quantity,
                                foodType: data.foodType
                            }))
                        }
                    }} disabled={quantity === 0}>
                        <FaShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FoodCard
