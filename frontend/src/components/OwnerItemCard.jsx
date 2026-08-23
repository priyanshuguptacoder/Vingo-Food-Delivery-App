import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { getFoodImage } from '../utils/imageMapping';

function OwnerItemCard({data}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    // Check if image is an SVG or data URL, replace with our mapping
    const finalImage = (data.image && (data.image.startsWith('data:image/svg+xml') || data.image.includes('<svg'))) ? getFoodImage(data.name) : (data.image || getFoodImage(data.name));
    
    const handleDelete = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='flex bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 w-full max-w-2xl'>
      <div className='w-36 h-36 flex-shrink-0 bg-gray-50'>
        <img src={finalImage} alt={data.name} className='w-full h-full object-cover object-center'/>
      </div>
      <div className='flex flex-col justify-between p-4 flex-1'>
          <div>
            <h2 className='text-lg font-bold text-gray-900 mb-1 truncate' title={data.name}>{data.name}</h2>
            <p className='text-sm text-gray-600 mb-0.5'><span className='font-semibold text-gray-700'>Category:</span> {data.category}</p>
            <p className='text-sm text-gray-600'><span className='font-semibold text-gray-700'>Type:</span> {data.foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
          </div>
          <div className='flex items-center justify-between mt-2'>
            <div className='text-[#ff4d2d] font-extrabold text-xl'>₹{data.price}</div>
            <div className='flex items-center gap-2'>
                <button className='p-2.5 cursor-pointer rounded-full bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-[#ff4d2d] transition-colors border border-gray-100' onClick={() => navigate(`/edit-item/${data._id}`)}>
                    <FaPen size={14}/>
                </button>
                <button className='p-2.5 cursor-pointer rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors border border-gray-100' onClick={handleDelete}>
                    <FaTrashAlt size={14}/>
                </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default OwnerItemCard
