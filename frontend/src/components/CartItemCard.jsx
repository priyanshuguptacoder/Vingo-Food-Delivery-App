import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
import { getFoodImage } from '../utils/imageMapping';

function CartItemCard({data}) {
    const dispatch = useDispatch()
    
    // Check if image is an SVG or data URL, replace with our mapping
    const finalImage = (data.image && (data.image.startsWith('data:image/svg+xml') || data.image.includes('<svg'))) ? getFoodImage(data.name) : (data.image || getFoodImage(data.name));
    
    const handleIncrease = (id, currentQty) => {
       dispatch(updateQuantity({id, quantity: currentQty + 1}))
    }
    
    const handleDecrease = (id, currentQty) => {
        if(currentQty > 1){
            dispatch(updateQuantity({id, quantity: currentQty - 1}))
        }
    }
    
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow gap-4'>
      <div className='flex items-center gap-4 w-full sm:w-auto'>
        <div className='w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden'>
            <img src={finalImage} alt={data.name} className='w-full h-full object-cover'/>
        </div>
        <div className='flex-1'>
            <h1 className='font-bold text-gray-900 text-lg mb-0.5 capitalize'>{data.name}</h1>
            {data.shop?.name && (
                <p className='text-xs font-semibold text-gray-500 mb-1.5 capitalize'>{data.shop.name}</p>
            )}
            <p className='text-sm text-gray-500 font-medium'>₹{data.price} x {data.quantity}</p>
            <p className="font-extrabold text-[#ff4d2d] text-lg mt-1">₹{data.price * data.quantity}</p>
        </div>
      </div>
      
      <div className='flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-xl'>
        <div className='flex items-center bg-white sm:bg-gray-50 rounded-full border border-gray-200 sm:border-gray-200 p-0.5 shadow-sm sm:shadow-none'>
            <button className='w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 text-gray-600 transition-colors' onClick={() => handleDecrease(data.id, data.quantity)}>
                <FaMinus size={12}/>
            </button>
            <span className='w-8 text-center font-bold text-gray-800'>{data.quantity}</span>
            <button className='w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 text-gray-600 transition-colors' onClick={() => handleIncrease(data.id, data.quantity)}>
                <FaPlus size={12}/>
            </button>
        </div>
        
        <button className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-sm sm:shadow-none" onClick={() => dispatch(removeCartItem(data.id))}>
            <CiTrash size={20}/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard
