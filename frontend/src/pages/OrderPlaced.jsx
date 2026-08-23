import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#fff9f6] flex justify-center items-center px-4 relative overflow-hidden'>
      <div className='w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-10 flex flex-col items-center text-center border border-gray-100 relative z-10'>
        <div className='w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6'>
            <FaCircleCheck className='text-green-500 text-5xl drop-shadow-sm'/>
        </div>
        
        <h1 className='text-4xl font-extrabold text-gray-900 mb-4 tracking-tight'>Order Placed!</h1>
        
        <p className='text-gray-600 text-lg mb-10 font-medium leading-relaxed'>
          Thank you for your purchase. Your delicious food is being prepared.
          You can track your order status in the "My Orders" section.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
            <button className='flex-1 bg-white border-2 border-[#ff4d2d] text-[#ff4d2d] px-6 py-4 rounded-xl text-lg font-bold hover:bg-orange-50 active:scale-[0.98] transition-all cursor-pointer' onClick={() => navigate("/")}>
                Home
            </button>
            <button className='flex-1 bg-[#ff4d2d] text-white px-6 py-4 rounded-xl text-lg font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer' onClick={() => navigate("/my-orders")}>
                My Orders
            </button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className='absolute top-20 -left-20 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl'></div>
      <div className='absolute bottom-20 -right-20 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl'></div>
    </div>
  )
}

export default OrderPlaced
