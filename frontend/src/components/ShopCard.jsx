import React from 'react'
import { FaStar } from 'react-icons/fa'

function ShopCard({ name, image, address, onClick }) {
  return (
    <div className='w-[280px] h-[260px] md:w-[320px] md:h-[280px] rounded-2xl border border-gray-100 shrink-0 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer flex flex-col' onClick={onClick}>
        <div className='w-full h-[65%] overflow-hidden bg-gray-100'>
            <img src={image} alt={name} className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'/>
        </div>
        
        <div className='p-4 flex flex-col justify-between flex-1 bg-white'>
            <div>
                <h3 className='text-lg font-bold text-gray-900 truncate capitalize'>{name}</h3>
                <p className='text-sm text-gray-500 truncate mt-1 capitalize'>{address || "Local Restaurant"}</p>
            </div>
            
            <div className='flex items-center justify-between mt-3'>
                <div className='flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-100'>
                    <FaStar className='text-green-600 text-[10px]' />
                    <span className='text-xs font-bold text-green-700'>4.5</span>
                </div>
                <div className='text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md'>
                    30-40 min
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShopCard
