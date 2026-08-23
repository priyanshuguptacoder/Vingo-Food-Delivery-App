import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function Nav() {
    const { userData, currentCity, cartItems } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
            dispatch(setSearchItems(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (query) {
            handleSearchItems()
        } else {
            dispatch(setSearchItems(null))
        }
    }, [query])

    return (
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-6 fixed top-0 z-[9999] bg-white shadow-sm border-b border-gray-100'>

            {showSearch && userData.role === "user" && <div className='w-[90%] h-[60px] bg-white shadow-xl rounded-xl items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden border border-gray-100 overflow-hidden'>
                <div className='flex items-center w-[40%] overflow-hidden gap-[10px] px-[15px] border-r border-gray-200 bg-gray-50 h-full'>
                    <FaLocationDot size={20} className="text-[#ff4d2d] flex-shrink-0" />
                    <div className='w-[80%] truncate text-gray-700 font-medium text-sm'>{currentCity}</div>
                </div>
                <div className='w-[60%] flex items-center gap-[10px] px-[10px] h-full'>
                    <IoIosSearch size={22} className='text-gray-400 flex-shrink-0' />
                    <input type="text" placeholder='Search delicious food...' className='text-gray-700 outline-none w-full text-sm' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <h1 className='text-3xl font-extrabold text-[#ff4d2d] tracking-tight cursor-pointer hover:opacity-90 transition-opacity' onClick={() => navigate('/')}>Vingo</h1>
            
            {userData.role === "user" && <div className='md:w-[60%] lg:w-[45%] h-[50px] bg-gray-50 rounded-full items-center hidden md:flex border border-gray-200 focus-within:border-[#ff4d2d] focus-within:ring-2 focus-within:ring-[#ff4d2d]/20 transition-all overflow-hidden'>
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[20px] border-r border-gray-300 h-full'>
                    <FaLocationDot size={20} className="text-[#ff4d2d] flex-shrink-0" />
                    <div className='w-full truncate text-gray-700 font-medium text-sm'>{currentCity}</div>
                </div>
                <div className='w-[70%] flex items-center gap-[10px] px-[15px] h-full'>
                    <IoIosSearch size={22} className='text-gray-400 flex-shrink-0' />
                    <input type="text" placeholder='Search delicious food...' className='text-gray-700 outline-none w-full bg-transparent text-sm' onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>
            </div>}

            <div className='flex items-center gap-5'>
                {userData.role === "user" && (showSearch ? <RxCross2 size={24} className='text-gray-600 md:hidden cursor-pointer hover:text-[#ff4d2d] transition-colors' onClick={() => setShowSearch(false)} /> : <IoIosSearch size={24} className='text-gray-600 md:hidden cursor-pointer hover:text-[#ff4d2d] transition-colors' onClick={() => setShowSearch(true)} />)
                }
                
                {userData.role === "owner" ? <>
                    {myShopData && <> 
                        <button className='hidden md:flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:bg-[#ff4d2d]/20 transition-colors' onClick={() => navigate("/add-item")}>
                            <FaPlus size={18} />
                            <span>Add Food Item</span>
                        </button>
                        <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition-colors' onClick={() => navigate("/add-item")}>
                            <FaPlus size={18} />
                        </button>
                    </>}
                   
                    <div className='hidden md:flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={20} />
                        <span>My Orders</span>
                    </div>
                    <div className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors' onClick={() => navigate("/my-orders")}>
                        <TbReceipt2 size={20} />
                    </div>
                </> : (
                    <>
                        {userData.role === "user" && <div className='relative cursor-pointer hover:scale-110 transition-transform' onClick={() => navigate("/cart")}>
                            <FiShoppingCart size={24} className='text-gray-700 hover:text-[#ff4d2d] transition-colors' />
                            {cartItems?.length > 0 && <span className='absolute -right-2 -top-2 bg-[#ff4d2d] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white'>{cartItems.length}</span>}
                        </div>}   

                        <button className='hidden md:block px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors' onClick={() => navigate("/my-orders")}>
                            My Orders
                        </button>
                    </>
                )}

                <div className='w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-lg font-bold shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all' onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName?.slice(0, 1).toUpperCase()}
                </div>
                
                {showInfo && <div className={`fixed top-[70px] right-[20px] 
                    ${userData.role === "deliveryBoy" ? "md:right-[20%] lg:right-[40%]" : "md:right-[10%] lg:right-[25%]"} w-[200px] bg-white shadow-2xl rounded-2xl p-4 flex flex-col gap-2 z-[9999] border border-gray-100`}>
                    <div className='text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-1 truncate'>{userData.fullName}</div>
                    {userData.role === "user" && <div className='md:hidden px-3 py-2 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 rounded-lg transition-colors' onClick={() => navigate("/my-orders")}>My Orders</div>}
                    
                    <div className='px-3 py-2 text-red-600 font-bold cursor-pointer hover:bg-red-50 rounded-lg transition-colors' onClick={handleLogOut}>Log Out</div>
                </div>}

            </div>
        </div>
    )
}

export default Nav
