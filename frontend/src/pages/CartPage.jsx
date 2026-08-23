import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    
    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-4 md:p-8'>
            <div className='w-full max-w-3xl flex flex-col'>
                <div className='flex items-center gap-3 mb-8 sticky top-0 bg-[#fff9f6]/90 backdrop-blur py-4 z-10 border-b border-[#ff4d2d]/10'>
                    <div className='cursor-pointer p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d]' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={28} />
                    </div>
                    <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Your Cart</h1>
                    {cartItems?.length > 0 && <span className='bg-orange-100 text-[#ff4d2d] px-3 py-1 rounded-full font-bold text-sm ml-auto'>{cartItems.length} items</span>}
                </div>
                
                {cartItems?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100'>
                        <div className='w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[#ff4d2d] text-4xl opacity-50'>🛒</div>
                        <p className='text-gray-900 font-bold text-xl mb-2'>Your cart is empty</p>
                        <p className='text-gray-500 mb-8 font-medium'>Looks like you haven't added any delicious food yet.</p>
                        <button className='bg-[#ff4d2d] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#e64323] hover:shadow-lg active:scale-95 transition-all' onClick={() => navigate("/")}>
                            Explore Restaurants
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col gap-6 pb-20'>
                        <div className='space-y-4'>
                            {cartItems?.map((item, index) => (
                                <CartItemCard data={item} key={index} />
                            ))}
                        </div>
                        
                        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4'>
                            <h2 className='text-lg font-bold text-gray-800 border-b border-gray-100 pb-3'>Order Summary</h2>
                            <div className='flex justify-between items-center text-gray-600 font-medium'>
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className='flex justify-between items-center text-gray-600 font-medium'>
                                <span>Delivery Fee</span>
                                <span className='text-green-600 font-bold'>Free</span>
                            </div>
                            <div className='flex justify-between items-center pt-3 border-t border-gray-100 mt-2'>
                                <span className='text-xl font-extrabold text-gray-900'>Total Amount</span>
                                <span className='text-3xl font-black text-[#ff4d2d]'>₹{totalAmount}</span>
                            </div>
                        </div>
                        
                        <button className='w-full bg-[#ff4d2d] text-white px-6 py-4 rounded-xl text-xl font-bold shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2' onClick={() => navigate("/checkout")}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage
