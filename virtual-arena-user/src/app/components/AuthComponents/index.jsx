'use client'
import { fetchUserData } from '@/Store/Actions/userActions'
import { closeModal } from '@/Store/ReduxSlice/ModalSlice'
import { API_URL } from '@/utils/ApiUrl'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react' 

const AuthComponents = () => {
    const MODE = {
        LOGIN: "LOGIN",
        REGISTER: "REGISTER",
        RESET_PASSWORD: "RESET_PASSWORD",
        EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
    }

    const { modes } = useSelector((state) => state.modal)
    const [mode, setMode] = useState(modes || MODE.REGISTER)

    const formTitle =
        mode === MODE.LOGIN
            ? "Log in"
            : mode === MODE.REGISTER
                ? "Register"
                : mode === MODE.RESET_PASSWORD
                    ? "Reset Your Password"
                    : "Verify Your Email"

    const buttonTitle =
        mode === MODE.LOGIN
            ? "Login"
            : mode === MODE.REGISTER
                ? "Register"
                : mode === MODE.RESET_PASSWORD
                    ? "Reset"
                    : "Verify"

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (mode === MODE.REGISTER && formData.password !== formData.confirmPassword) {
            setIsLoading(false)
            setError("Passwords do not match!")
            toast.error("Passwords do not match!")
            return
        }

        try {
            let response
            switch (mode) {
                case MODE.REGISTER:
                    response = await axios.post(`${API_URL}/auth/signup`, {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                    if (response.status === 201) {
                        toast.success("Registered Successfully")
                        setMode(MODE.LOGIN)
                    } else {
                        toast.error("Registration failed")
                    }
                    break

                case MODE.LOGIN:
                    response = await axios.post(`${API_URL}/auth/login`, {
                        email: formData.email,
                        password: formData.password
                    })

                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.token)
                        toast.success("Login Successfully")
                        dispatch(closeModal())
                        dispatch(fetchUserData())
                    } else {
                        toast.error("Login failed")
                    }
                    break

                case MODE.RESET_PASSWORD:
                    // Reset password logic
                    break

                case MODE.EMAIL_VERIFICATION:
                    // Email verification logic
                    break

                default:
                    throw new Error('Invalid mode')
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Something went wrong'
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='text-white w-full max-w-[540px]'>
            <h1 className='text-[50px] font-bold text-white text-center'>{formTitle}</h1>
            <p className='text-lg text-white mt-3 text-center'>
                {mode === MODE.LOGIN
                    ? 'Welcome back! Please enter your details'
                    : "Please fill in the form to create an account!"}
            </p>
            <form className='mt-[51px] w-full max-w-[540px]' onSubmit={handleSubmit}>
                {mode === MODE.REGISTER && (
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xl font-semibold">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 mb-4"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1 w-full">
                    <label className="text-xl font-semibold">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 mb-4"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
                    <div className="flex flex-col gap-1 w-full relative">
                        <label className="text-xl font-semibold">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Type Password"
                            className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 mb-4 pr-10"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div
                            className="absolute right-4 top-[52px] cursor-pointer"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>
                )}

                {mode === MODE.REGISTER && (
                    <div className="flex flex-col gap-1 w-full relative">
                        <label className="text-xl font-semibold">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-Type Password"
                            className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 pr-10"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <div
                            className="absolute right-4 top-[52px] cursor-pointer"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                            <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
                        )}
                    </div>
                )}

                {error && (
                    <h1 className='font-medium text-[14px] mb-4 text-red-400'>{error}</h1>
                )}

                {mode === MODE.LOGIN && (
                    <div className="flex justify-between items-center mb-7">
                        <div className='flex gap-2 items-center'>
                            <input type="checkbox" className='h-[14px] w-[14px]' />
                            <span className='text-[14px] font-medium text-white'>Remember for 30 days</span>
                        </div>
                        <div className="text-18 underline cursor-pointer" onClick={() => setMode(MODE.RESET_PASSWORD)}>
                            Forgot Password?
                        </div>
                    </div>
                )}

                <button
                    className="bg-white text-black w-full p-[14px] text-lg rounded-md font-semibold"
                    disabled={isLoading}
                >
                    {isLoading ? 'Please wait...' : buttonTitle}
                </button>

                {mode === MODE.LOGIN && (
                    <>
                        <div className="flex gap-4 items-center mt-4 mb-4">
                            <span className='border-b w-full border-white'></span>
                            <span className='text-xl font-semibold'>OR</span>
                            <span className='border-b w-full border-white'></span>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4 md:gap-10 justify-between items-center'>
                            <button className='bg-white w-full text-black flex items-center gap-3 text-[12px] font-medium rounded-lg py-4 px-8'>
                                <img src="/assets/google.png" alt="Google logo" />
                                <span>Sign up with Google</span>
                            </button>
                            <button className='bg-white w-full text-black flex items-center gap-3 text-[12px] font-medium rounded-lg py-4 px-8'>
                                <img src="/assets/apple.png" alt="Apple logo" />
                                <span>Sign up with Apple</span>
                            </button>
                        </div>
                    </>
                )}

                {mode === MODE.REGISTER && (
                    <div className="text-lg mt-4 text-center pb-5">
                        Already have an account?{' '}
                        <span className='font-medium cursor-pointer' onClick={() => setMode(MODE.LOGIN)}>Login here</span>
                    </div>
                )}

                {mode === MODE.LOGIN && (
                    <div className="text-lg mt-4 text-center pb-5">
                        Don’t have an account?{' '}
                        <span className='font-medium cursor-pointer' onClick={() => setMode(MODE.REGISTER)}>Sign Up</span>
                    </div>
                )}
            </form>
        </div>
    )
}

export default AuthComponents
