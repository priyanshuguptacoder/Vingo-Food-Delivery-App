import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount } from '../redux/userSlice';

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  const getCurrentLocation = () => {
      const latitude = userData.location.coordinates[1]
      const longitude = userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
  }

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon
        },
        totalAmount: AmountWithDeliveryFee,
        cartItems
      }, { withCredentials: true })

      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data))
        navigate("/order-placed")
      } else {
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorpayWindow(orderId, razorOrder)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name: "Vingo",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            orderId
          }, { withCredentials: true })
          dispatch(addMyOrder(result.data))
          navigate("/order-placed")
        } catch (error) {
          console.log(error)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='min-h-screen bg-[#fff9f6] flex justify-center p-4 md:p-8 relative'>
      <div className='absolute top-4 md:top-8 left-4 md:left-8 cursor-pointer p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d] z-10' onClick={() => navigate(-1)}>
        <IoIosArrowRoundBack size={32} />
      </div>
      
      <div className='w-full max-w-4xl flex flex-col gap-8'>
        <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight text-center md:text-left md:ml-16 mt-2 mb-2'>Secure Checkout</h1>
        
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            {/* Location Section */}
            <section className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-900'>
                <div className='p-2 bg-orange-50 rounded-full'>
                  <IoLocationSharp className='text-[#ff4d2d]' size={20}/>
                </div>
                Delivery Address
              </h2>
              
              <div className='flex flex-col sm:flex-row gap-3 mb-6'>
                <input type="text" className='flex-1 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all bg-gray-50' placeholder='Enter Your Delivery Address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
                <div className='flex gap-2 sm:gap-3'>
                  <button className='flex-1 sm:flex-none bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm' onClick={getLatLngByAddress}>
                    <IoSearchOutline size={20} />
                  </button>
                  <button className='flex-1 sm:flex-none bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 px-5 py-3 rounded-xl flex items-center justify-center transition-all shadow-sm' onClick={getCurrentLocation} title="Use Current Location">
                    <TbCurrentLocation size={20} />
                  </button>
                </div>
              </div>
              
              <div className='rounded-2xl border border-gray-200 overflow-hidden shadow-sm'>
                <div className='h-[300px] w-full flex items-center justify-center bg-gray-50'>
                  <MapContainer
                    className={"w-full h-full"}
                    center={[location?.lat, location?.lon]}
                    zoom={16}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap location={location} />
                    <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
                  </MapContainer>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-900'>
                 <div className='p-2 bg-green-50 rounded-full'>
                  <FaCreditCard className='text-green-600' size={18}/>
                </div>
                Payment Method
              </h2>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50/50 shadow-sm" : "border-gray-100 hover:border-gray-300 bg-white"}`} onClick={() => setPaymentMethod("cod")}>
                  <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100/80 shrink-0'>
                    <MdDeliveryDining className='text-green-700 text-2xl' />
                  </span>
                  <div>
                    <p className='font-bold text-gray-900'>Cash On Delivery</p>
                    <p className='text-xs text-gray-500 mt-0.5 font-medium'>Pay when food arrives</p>
                  </div>
                  {paymentMethod === "cod" && <div className='ml-auto w-4 h-4 rounded-full bg-[#ff4d2d] border-4 border-orange-200'></div>}
                </div>
                
                <div className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50/50 shadow-sm" : "border-gray-100 hover:border-gray-300 bg-white"}`} onClick={() => setPaymentMethod("online")}>
                  <div className='flex -space-x-3 shrink-0'>
                    <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100/80 ring-2 ring-white z-10'>
                      <FaMobileScreenButton className='text-purple-700 text-xl' />
                    </span>
                    <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100/80 ring-2 ring-white'>
                      <FaCreditCard className='text-blue-700 text-lg' />
                    </span>
                  </div>
                  <div>
                    <p className='font-bold text-gray-900'>Pay Online</p>
                    <p className='text-xs text-gray-500 mt-0.5 font-medium'>UPI / Cards / Wallets</p>
                  </div>
                  {paymentMethod === "online" && <div className='ml-auto w-4 h-4 rounded-full bg-[#ff4d2d] border-4 border-orange-200'></div>}
                </div>
              </div>
            </section>
          </div>

          <div className='lg:col-span-1'>
            {/* Order Summary */}
            <section className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-6'>
              <h2 className='text-xl font-bold mb-6 text-gray-900'>Order Summary</h2>
              
              <div className='space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar'>
                {cartItems.map((item,index)=>(
                  <div key={index} className='flex justify-between items-start gap-4'>
                    <div className='flex-1'>
                      <p className='font-bold text-gray-800 text-sm'>{item.name}</p>
                      <p className='text-xs text-gray-500 font-medium'>Qty: {item.quantity}</p>
                    </div>
                    <span className='font-bold text-gray-900 text-sm'>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className='border-t border-dashed border-gray-200 pt-4 space-y-3 mb-6'>
                <div className='flex justify-between font-medium text-gray-600 text-sm'>
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className='flex justify-between font-medium text-gray-600 text-sm'>
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                </div>
              </div>
              
              <div className='flex justify-between items-center text-xl font-extrabold text-gray-900 pt-4 border-t border-gray-100 mb-8'>
                <span>Total</span>
                <span className='text-[#ff4d2d] text-2xl'>₹{AmountWithDeliveryFee}</span>
              </div>
              
              <button className='w-full bg-[#ff4d2d] text-white py-4 rounded-xl font-bold text-lg shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer' onClick={handlePlaceOrder}>
                {paymentMethod === "cod" ? "Place Order (COD)" : "Pay & Place Order"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut
