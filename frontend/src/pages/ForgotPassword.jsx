import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { FaLock, FaEnvelope, FaKey, FaShieldAlt } from "react-icons/fa";

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email,setEmail]=useState("")
  const [otp,setOtp]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [err,setErr]=useState("")
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)
  
  const handleSendOtp=async () => {
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
      console.log(result)
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
       setErr(error.response.data.message)
       setLoading(false)
    }
  }
  
  const handleVerifyOtp=async () => {
      setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
      console.log(result)
      setErr("")
      setStep(3)
        setLoading(false)
    } catch (error) {
        setErr(error?.response?.data?.message)
          setLoading(false)
    }
  }
  
  const handleResetPassword=async () => {
    if(newPassword!=confirmPassword){
      setErr("Passwords do not match")
      return null
    }
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},{withCredentials:true})
      setErr("")
      console.log(result)
        setLoading(false)
      navigate("/signin")
    } catch (error) {
     setErr(error?.response?.data?.message)
       setLoading(false)
    }
  }
  
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6] relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-200/40 rounded-full blur-3xl'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-orange-300/30 rounded-full blur-3xl'></div>
      
      <div className='absolute top-4 md:top-8 left-4 md:left-8 cursor-pointer p-2 hover:bg-orange-50 rounded-full transition-colors text-[#ff4d2d] z-10' onClick={() => navigate("/signin")}>
          <IoIosArrowRoundBack size={32} />
      </div>

      <div className='bg-white rounded-3xl shadow-xl shadow-orange-100/50 w-full max-w-md p-8 md:p-10 border border-gray-100 relative z-10'>
        <div className='flex flex-col items-center mb-8'>
            <div className='w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-[#ff4d2d] rotate-3 shadow-sm border border-orange-100'>
                {step === 1 ? <FaLock size={28} /> : step === 2 ? <FaShieldAlt size={28} /> : <FaKey size={28} />}
            </div>
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight text-center'>
                {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'New Password'}
            </h1>
            <p className='text-gray-500 font-medium text-center mt-2'>
                {step === 1 ? 'Enter your email to receive a reset code' : step === 2 ? `We sent a code to ${email}` : 'Create a strong new password'}
            </p>
        </div>

        {/* Progress indicator */}
        <div className='flex justify-center gap-2 mb-8'>
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 1 ? 'w-8 bg-[#ff4d2d]' : 'w-2 bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 2 ? 'w-8 bg-[#ff4d2d]' : 'w-2 bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 3 ? 'w-8 bg-[#ff4d2d]' : 'w-2 bg-gray-200'}`}></div>
        </div>
        
        {err && (
            <div className='bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm border border-red-100 flex items-start gap-2'>
                <span className='font-bold'>!</span> {err}
            </div>
        )}

        {step === 1 && (
          <div className='animate-fadeIn'>
                <div className='mb-6 space-y-1.5'>
                    <label htmlFor="email" className='block text-sm font-bold text-gray-700 ml-1'>Email Address</label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400'>
                            <FaEnvelope />
                        </div>
                        <input type="email" className='w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800' placeholder='e.g. hello@example.com' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                    </div>
                </div>
                <button className={`w-full py-4 rounded-xl transition-all duration-200 bg-[#ff4d2d] text-white font-bold text-lg shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex justify-center items-center mt-2`} onClick={handleSendOtp} disabled={loading || !email}>
                    {loading ? <ClipLoader size={24} color='white'/> : "Send Reset Code"}
                </button>
          </div>
        )}

        {step === 2 && (
          <div className='animate-fadeIn'>
                <div className='mb-6 space-y-1.5'>
                    <label htmlFor="otp" className='block text-sm font-bold text-gray-700 ml-1'>6-Digit Code</label>
                    <input type="text" className='w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-bold text-center tracking-[0.5em] text-xl text-gray-800' placeholder='••••••' onChange={(e)=>setOtp(e.target.value)} value={otp} maxLength={6} required/>
                </div>
                <button className={`w-full py-4 rounded-xl transition-all duration-200 bg-[#ff4d2d] text-white font-bold text-lg shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex justify-center items-center mt-2`} onClick={handleVerifyOtp} disabled={loading || otp.length < 4}>
                    {loading ? <ClipLoader size={24} color='white'/> : "Verify Code"}
                </button>
                <div className='text-center mt-6'>
                    <button onClick={handleSendOtp} className='text-[#ff4d2d] font-bold text-sm hover:underline' disabled={loading}>Resend Code</button>
                </div>
          </div>
        )}
        
        {step === 3 && (
          <div className='animate-fadeIn'>
                <div className='mb-4 space-y-1.5'>
                    <label htmlFor="newPassword" className='block text-sm font-bold text-gray-700 ml-1'>New Password</label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400'>
                            <FaKey />
                        </div>
                        <input type="password" className='w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800' placeholder='Minimum 6 characters' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} required minLength={6}/>
                    </div>
                </div>
                <div className='mb-6 space-y-1.5'>
                    <label htmlFor="confirmPassword" className='block text-sm font-bold text-gray-700 ml-1'>Confirm Password</label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400'>
                            <FaLock />
                        </div>
                        <input type="password" className='w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/30 focus:border-[#ff4d2d] transition-all font-medium text-gray-800' placeholder='Confirm new password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required/>
                    </div>
                </div>
                <button className={`w-full py-4 rounded-xl transition-all duration-200 bg-[#ff4d2d] text-white font-bold text-lg shadow-md shadow-orange-200 hover:bg-[#e64323] hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex justify-center items-center mt-2`} onClick={handleResetPassword} disabled={loading || !newPassword || !confirmPassword}>
                    {loading ? <ClipLoader size={24} color='white'/> : "Reset Password"}
                </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
