import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCamera } from "react-icons/fa";
import { useState, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function AddItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const [loading,setLoading]=useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("veg")
    
    const fileInputRef = useRef(null)
    
    const categories = ["Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"]
        
    const dispatch = useDispatch()
    
    const handleImage = (e) => {
        const file = e.target.files[0]
        if(file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("category",category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    
    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center flex-col items-center p-4 py-12 relative'>
            <div className='absolute top-4 md:top-8 left-4 md:left-8 cursor-pointer p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d] z-10' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={32} />
            </div>

            <div className='max-w-xl w-full bg-white shadow-sm rounded-3xl p-6 md:p-10 border border-gray-100'>
                <div className='flex flex-col items-center mb-8'>
                    <div className='bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-orange-100 rotate-3'>
                        <FaUtensils className='text-[#ff4d2d] w-10 h-10' />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Add New Item
                    </div>
                    <p className='text-gray-500 mt-2 font-medium text-center'>
                        Add a delicious new dish to your menu
                    </p>
                </div>
                
                <form className='space-y-6' onSubmit={handleSubmit}>
                    
                    {/* Image Upload Section */}
                    <div className='flex flex-col items-center gap-4 mb-8'>
                        <input 
                            type="file" 
                            accept='image/*' 
                            className='hidden' 
                            ref={fileInputRef}
                            onChange={handleImage}  
                        />
                        
                        <div 
                            className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${frontendImage ? 'border-transparent' : 'border-gray-300 hover:border-[#ff4d2d] bg-gray-50 hover:bg-orange-50/50'}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {frontendImage ? (
                                <>
                                    <img src={frontendImage} alt="Food preview" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'/>
                                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                        <div className='bg-white text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg'>
                                            <FaCamera /> Change Image
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-gray-400 group-hover:text-[#ff4d2d]'>
                                        <FaCamera size={20}/>
                                    </div>
                                    <p className='font-bold text-gray-700 group-hover:text-[#ff4d2d]'>Upload Food Image</p>
                                    <p className='text-xs text-gray-500 mt-1'>High quality images attract more customers</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='space-y-1.5'>
                        <label className='block text-sm font-bold text-gray-700 ml-1'>Item Name</label>
                        <input type="text" placeholder='e.g. Margherita Pizza' className='w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div className='space-y-1.5'>
                            <label className='block text-sm font-bold text-gray-700 ml-1'>Price (₹)</label>
                            <input type="number" placeholder='e.g. 299' className='w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                required
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='block text-sm font-bold text-gray-700 ml-1'>Category</label>
                            <select className='w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800 cursor-pointer appearance-none'
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((cate, index) => (
                                    <option value={cate} key={index}>{cate}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-bold text-gray-700 ml-1'>Food Type</label>
                        <div className='flex gap-4'>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${foodType === 'veg' ? 'border-green-500 bg-green-50 text-green-700 font-bold shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 font-medium hover:border-gray-300'}`}>
                                <input type="radio" name="foodType" value="veg" checked={foodType === 'veg'} onChange={(e) => setFoodType(e.target.value)} className='hidden' />
                                <div className='w-4 h-4 border-2 border-green-600 flex items-center justify-center'>
                                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                                </div>
                                Pure Veg
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${foodType === 'non veg' ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 font-medium hover:border-gray-300'}`}>
                                <input type="radio" name="foodType" value="non veg" checked={foodType === 'non veg'} onChange={(e) => setFoodType(e.target.value)} className='hidden' />
                                <div className='w-4 h-4 border-2 border-red-600 flex items-center justify-center'>
                                    <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                                </div>
                                Non Veg
                            </label>
                        </div>
                    </div>

                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-4 rounded-xl text-lg font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center mt-6' disabled={loading}>
                      {loading ? <ClipLoader size={24} color='white' /> : "Add Item"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddItem
