import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../components/FoodCard';
import { IoIosArrowRoundBack } from "react-icons/io";
import { getShopImage } from '../utils/imageMapping';

function Shop() {
    const {shopId} = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)
    const navigate = useNavigate()
    
    const handleShop = async () => {
        try {
           const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, {withCredentials:true}) 
           setShop(result.data.shop)
           setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])

  return (
    <div className='min-h-screen bg-[#fff9f6] pb-20'>
        <div className='fixed top-4 left-4 z-50'>
            <div className='cursor-pointer p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full transition-all text-[#ff4d2d] shadow-sm border border-gray-100 hover:scale-105 hover:shadow-md' onClick={() => navigate(-1)}>
                <IoIosArrowRoundBack size={32} />
            </div>
        </div>
        
        {shop && (
            <div className='relative w-full h-[40vh] md:h-[50vh] min-h-[300px]'>
                <img src={shop.image && (shop.image.startsWith('data:image/svg+xml') || shop.image.includes('<svg')) ? getShopImage(shop.name) : (shop.image || getShopImage(shop.name))} alt={shop.name} className='w-full h-full object-cover'/>
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end px-6 md:px-16 pb-12'>
                    <div className='max-w-7xl w-full mx-auto'>
                        <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3'>
                            <FaStore className='text-[#ff4d2d] text-3xl' />
                        </div>
                        <h1 className='text-4xl md:text-6xl font-black text-white drop-shadow-md mb-4 tracking-tight'>{shop.name}</h1>
                        <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm w-fit px-4 py-2 rounded-full border border-white/30'>
                            <FaLocationDot size={16} className='text-[#ff4d2d]'/>
                            <p className='text-sm md:text-base font-medium text-white'>{shop.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12'>
            <div className='flex items-center justify-between mb-10'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center'>
                        <FaUtensils className='text-[#ff4d2d] text-lg'/>
                    </div>
                    <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Our Menu</h2>
                </div>
                <div className='text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full'>
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </div>
            </div>

            {items.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'>
                    {items.map((item, index) => (
                        <div key={index} className='w-full flex justify-center'>
                            <FoodCard data={item} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100'>
                    <div className='w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[#ff4d2d] text-4xl opacity-50'>🍽️</div>
                    <p className='text-gray-900 font-bold text-xl mb-2'>Menu is empty</p>
                    <p className='text-gray-500 mb-8 font-medium'>This restaurant hasn't added any items yet.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Shop
