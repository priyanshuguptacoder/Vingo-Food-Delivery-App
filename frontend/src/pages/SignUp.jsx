import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("Mobile number is required for Google Sign Up")
        }
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6] py-10'>
            <div className='bg-white rounded-2xl shadow-xl shadow-orange-100/50 w-full max-w-md p-8 border border-gray-100'>
                <h1 className='text-4xl font-extrabold mb-3 text-[#ff4d2d] tracking-tight cursor-pointer' onClick={() => navigate('/')}>Vingo</h1>
                <p className='text-gray-500 mb-8 font-medium'>Create your account to get started with delicious food deliveries.</p>

                {/* fullName */}
                <div className='mb-5'>
                    <label htmlFor="fullName" className='block text-gray-700 font-semibold mb-2 text-sm'>Full Name</label>
                    <input type="text" id="fullName" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800' placeholder='Enter your full name' onChange={(e) => setFullName(e.target.value)} value={fullName} required />
                </div>
                
                {/* email */}
                <div className='mb-5'>
                    <label htmlFor="email" className='block text-gray-700 font-semibold mb-2 text-sm'>Email</label>
                    <input type="email" id="email" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                
                {/* mobile*/}
                <div className='mb-5'>
                    <label htmlFor="mobile" className='block text-gray-700 font-semibold mb-2 text-sm'>Mobile</label>
                    <input type="tel" id="mobile" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800' placeholder='Enter your mobile number' onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                </div>
                
                {/* password*/}
                <div className='mb-5'>
                    <label htmlFor="password" className='block text-gray-700 font-semibold mb-2 text-sm'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} id="password" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800 pr-12' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <button className='absolute right-4 cursor-pointer top-[14px] text-gray-400 hover:text-gray-600 transition-colors' type="button" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}</button>
                    </div>
                </div>
                
                {/* role*/}
                <div className='mb-8'>
                    <label className='block text-gray-700 font-semibold mb-2 text-sm'>Role</label>
                    <div className='flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200'>
                        {[{id: 'user', label: 'User'}, {id: 'owner', label: 'Owner'}, {id: 'deliveryBoy', label: 'Delivery Boy'}].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${role === r.id ? 'bg-[#ff4d2d] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                                onClick={() => setRole(r.id)}>
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button className='w-full font-bold py-3 rounded-xl transition-all duration-300 bg-[#ff4d2d] text-white hover:bg-[#e64323] hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] flex items-center justify-center cursor-pointer' onClick={handleSignUp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign Up"}
                </button>
                
                {err && <div className='bg-red-50 text-red-500 text-sm font-medium text-center p-3 rounded-lg mt-4 border border-red-100'>{err}</div>}

                <div className='relative flex py-6 items-center'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='flex-shrink-0 mx-4 text-gray-400 text-sm font-medium'>or</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                </div>

                <button className='w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer' onClick={handleGoogleAuth}>
                    <FcGoogle size={22} />
                    <span>Sign Up with Google</span>
                </button>
                
                <p className='text-center mt-8 text-gray-600 font-medium'>
                    Already have an account? <span className='text-[#ff4d2d] hover:text-[#e64323] font-bold cursor-pointer transition-colors' onClick={() => navigate("/signin")}>Sign In</span>
                </p>
            </div>
        </div>
    )
}

export default SignUp
