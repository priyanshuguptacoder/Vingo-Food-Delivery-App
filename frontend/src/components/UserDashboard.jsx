import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import ShopCard from './ShopCard'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }
  
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [categories, shopInMyCity])

  return (
    <div className='w-full flex flex-col gap-10 items-center bg-[#fff9f6] pb-20'>
      <Nav />

      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-7xl flex flex-col gap-6 items-start px-4 md:px-8 mt-6'>
          <h1 className='text-gray-900 text-2xl sm:text-3xl font-bold border-b-2 border-[#ff4d2d]/20 pb-3 w-full'>
            Search Results
          </h1>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl flex flex-col gap-6 items-start px-4 md:px-8 mt-6">
        <h2 className='text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight'>
          Inspiration for your first order
        </h2>
        <div className='w-full relative group'>
          {showLeftCateButton && <button className='absolute -left-4 top-1/2 -translate-y-1/2 bg-white text-[#ff4d2d] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-gray-100 opacity-0 group-hover:opacity-100' onClick={() => scrollHandler(cateScrollRef, "left")}><FaCircleChevronLeft size={24} />
          </button>}

          <div className='w-full flex overflow-x-auto gap-5 pb-4 scroll-smooth no-scrollbar' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={() => handleFilterByCategory(cate.category)} />
            ))}
          </div>
          
          {showRightCateButton && <button className='absolute -right-4 top-1/2 -translate-y-1/2 bg-white text-[#ff4d2d] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-gray-100 opacity-0 group-hover:opacity-100' onClick={() => scrollHandler(cateScrollRef, "right")}>
            <FaCircleChevronRight size={24} />
          </button>}
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-6 items-start px-4 md:px-8'>
        <h2 className='text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight'>
          Best Shops in {currentCity}
        </h2>
        <div className='w-full relative group'>
          {showLeftShopButton && <button className='absolute -left-4 top-1/2 -translate-y-1/2 bg-white text-[#ff4d2d] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-gray-100 opacity-0 group-hover:opacity-100' onClick={() => scrollHandler(shopScrollRef, "left")}><FaCircleChevronLeft size={24} />
          </button>}

          <div className='w-full flex overflow-x-auto gap-5 pb-4 scroll-smooth no-scrollbar p-2' ref={shopScrollRef}>
            {shopInMyCity?.length > 0 ? shopInMyCity.map((shop, index) => (
              <ShopCard name={shop.name} image={shop.image} address={shop.address} key={index} onClick={() => navigate(`/shop/${shop._id}`)} />
            )) : (
              <div className='text-gray-500 italic py-4'>No shops found in {currentCity}.</div>
            )}
          </div>
          
          {showRightShopButton && <button className='absolute -right-4 top-1/2 -translate-y-1/2 bg-white text-[#ff4d2d] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-gray-100 opacity-0 group-hover:opacity-100' onClick={() => scrollHandler(shopScrollRef, "right")}>
            <FaCircleChevronRight size={24} />
          </button>}
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-6 items-start px-4 md:px-8'>
        <h2 className='text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight'>
          Suggested Food Items
        </h2>

        {updatedItemsList?.length > 0 ? (
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center'>
            {updatedItemsList.map((item, index) => (
              <FoodCard key={index} data={item} />
            ))}
          </div>
        ) : (
          <div className='w-full text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100'>
            <p className='text-gray-500 font-medium text-lg'>No food items available for this selection.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
