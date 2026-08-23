import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './OwnerItemCard';
import { getShopImage } from '../utils/imageMapping';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full flex flex-col items-center pb-20'>
      <Nav />
      
      {!myShopData &&
        <div className='flex justify-center items-center p-4 sm:p-6 w-full mt-10'>
          <div className='w-full max-w-md bg-white shadow-sm rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6'>
                <FaUtensils className='text-[#ff4d2d] w-10 h-10' />
              </div>
              <h2 className='text-2xl font-extrabold text-gray-900 mb-3'>Add Your Restaurant</h2>
              <p className='text-gray-500 mb-8 font-medium leading-relaxed'>Join our food delivery platform and reach thousands of hungry customers every day.</p>
              <button className='w-full bg-[#ff4d2d] text-white py-3.5 rounded-xl font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] active:scale-[0.98] transition-all duration-200 cursor-pointer' onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }

      {myShopData &&
        <div className='w-full flex flex-col items-center gap-8 px-4 sm:px-6 mt-8'>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-4 text-center tracking-tight'>
            <div className='p-3 bg-orange-50 rounded-2xl'>
              <FaUtensils className='text-[#ff4d2d] w-8 h-8' />
            </div>
            Welcome to {myShopData.name}
          </h1>

          <div className='bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 w-full max-w-3xl relative group'>
            <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-700 p-2.5 rounded-full shadow-sm hover:bg-[#ff4d2d] hover:text-white transition-colors cursor-pointer z-10' onClick={() => navigate("/create-edit-shop")}>
              <FaPen size={18}/>
            </div>
            <div className='w-full h-48 sm:h-72 overflow-hidden'>
               <img src={myShopData.image && (myShopData.image.startsWith('data:image/svg+xml') || myShopData.image.includes('<svg')) ? getShopImage(myShopData.name) : (myShopData.image || getShopImage(myShopData.name))} alt={myShopData.name} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'/>
            </div>
            <div className='p-6 sm:p-8 flex flex-col gap-1 relative bg-white'>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>{myShopData.name}</h2>
              <p className='text-gray-500 font-medium flex items-center gap-2'>
                <span>{myShopData.city}, {myShopData.state}</span>
                <span className='w-1.5 h-1.5 bg-gray-300 rounded-full'></span>
                <span>{myShopData.address}</span>
              </p>
            </div>
          </div>

          {myShopData.items.length === 0 && 
            <div className='flex justify-center items-center w-full mt-4'>
              <div className='w-full max-w-md bg-white shadow-sm rounded-3xl p-8 border border-dashed border-gray-300 hover:border-[#ff4d2d]/50 transition-colors duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                    <FaUtensils className='text-gray-400 w-6 h-6' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>Add Your Food Item</h3>
                  <p className='text-gray-500 mb-6 text-sm font-medium'>Share your delicious creations with our customers by adding them to the menu.</p>
                  <button className='bg-[#ff4d2d] text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-[#e64323] hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer' onClick={() => navigate("/add-item")}>
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          }

          {myShopData.items.length > 0 && 
            <div className='w-full max-w-3xl flex flex-col gap-6 mt-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-gray-900'>Menu Items</h3>
                <button className='text-[#ff4d2d] font-semibold hover:text-[#e64323] bg-orange-50 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm' onClick={() => navigate("/add-item")}>
                  + Add New
                </button>
              </div>
              <div className='flex flex-col items-center gap-4 w-full'>
                {myShopData.items.map((item, index) => (
                  <OwnerItemCard data={item} key={index}/>
                ))}
              </div>
            </div>
          }
            
        </div>
      }
    </div>
  )
}

export default OwnerDashboard
