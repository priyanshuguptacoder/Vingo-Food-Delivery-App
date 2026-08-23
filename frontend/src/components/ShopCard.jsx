import React from 'react'
import { FaStar, FaClock } from 'react-icons/fa'
import { getShopImage } from '../utils/imageMapping'

function ShopCard({ name, image, address, onClick }) {
  // Check if image is an SVG or data URL, replace with our mapping
  const finalImage = (image && (image.startsWith('data:image/svg+xml') || image.includes('<svg'))) ? getShopImage(name) : (image || getShopImage(name));

  return (
    <div className='w-[280px] h-[220px] md:w-[320px] md:h-[240px] rounded-2xl shrink-0 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer' onClick={onClick}>
        <img src={finalImage} alt={name} className='absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500'/>
        
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4'>
            <h3 className='text-xl font-extrabold text-white line-clamp-2 capitalize drop-shadow-md leading-tight mb-1'>{name}</h3>
            <p className='text-sm text-gray-300 truncate capitalize mb-3 drop-shadow-sm'>{address || "Local Restaurant"}</p>
            
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10'>
                    <FaStar className='text-yellow-400 text-[12px]' />
                    <span className='text-xs font-bold text-white'>4.5</span>
                </div>
                <div className='flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10'>
                    <FaClock className='text-gray-300 text-[12px]' />
                    <span className='text-xs font-bold text-white'>30-40 min</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShopCard
