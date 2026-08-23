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
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#f3f4f6"; // gray-100 equivalent for softer borders

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignIn = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
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
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]'>
            <div className='bg-white rounded-2xl shadow-xl shadow-orange-100/50 w-full max-w-md p-8 border border-gray-100'>
                <h1 className='text-4xl font-extrabold mb-3 text-[#ff4d2d] tracking-tight cursor-pointer' onClick={() => navigate('/')}>Vingo</h1>
                <p className='text-gray-500 mb-8 font-medium'>Sign in to your account to get started with delicious food deliveries.</p>

                {/* email */}
                <div className='mb-5'>
                    <label htmlFor="email" className='block text-gray-700 font-semibold mb-2 text-sm'>Email</label>
                    <input type="email" id="email" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                {/* password*/}
                <div className='mb-3'>
                    <label htmlFor="password" className='block text-gray-700 font-semibold mb-2 text-sm'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} id="password" className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] transition-all bg-gray-50 text-gray-800 pr-12' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <button className='absolute right-4 cursor-pointer top-[14px] text-gray-400 hover:text-gray-600 transition-colors' type="button" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}</button>
                    </div>
                </div>

                <div className='text-right mb-6 text-sm'>
                    <span className='cursor-pointer text-[#ff4d2d] font-semibold hover:text-[#e64323] transition-colors' onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </span>
                </div>

                <button className='w-full font-bold py-3 rounded-xl transition-all duration-300 bg-[#ff4d2d] text-white hover:bg-[#e64323] hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] flex items-center justify-center cursor-pointer' onClick={handleSignIn} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign In"}
                </button>
                
                {err && <div className='bg-red-50 text-red-500 text-sm font-medium text-center p-3 rounded-lg mt-4 border border-red-100'>{err}</div>}

                <div className='relative flex py-6 items-center'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='flex-shrink-0 mx-4 text-gray-400 text-sm font-medium'>or</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                </div>

                <button className='w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer' onClick={handleGoogleAuth}>
                    <FcGoogle size={22} />
                    <span>Sign in with Google</span>
                </button>

                <p className='text-center mt-8 text-gray-600 font-medium'>
                    Don't have an account? <span className='text-[#ff4d2d] hover:text-[#e64323] font-bold cursor-pointer transition-colors' onClick={() => navigate("/signup")}>Sign Up</span>
                </p>
            </div>
        </div>
    )
}

export default SignIn
