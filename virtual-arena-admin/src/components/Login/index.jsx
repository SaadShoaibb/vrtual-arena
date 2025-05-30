'use client'
import { API_URL } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

import { FaArrowLeft, FaMinus } from 'react-icons/fa';


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""

    });
    useEffect(() => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
    
            if (!token || user?.role !== 'admin') {
                router.push('/'); // Redirect to login if not authenticated or not an admin
            }else{
                router.push('/dashboard'); // Redirect to login if not authenticated or not an admin

            }
        }, [router]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError("")
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email: formData.email, password: formData.password });
            console.log(response)
            if (response.status === 200 && response.data.success) {
                // Save token and user data in local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                }));
    
                toast.success("Logged In Successfully");
    
                // Redirect to dashboard if role is admin
                if (response.data.role === 'admin') {
                    // Initialize the router
                    router.push('/dashboard'); // Redirect to the dashboard page
                }
            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }

    }
    return (
        <div className="h-screen overflow-y-hidden relative  ">

            <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#00000000] to-[#00000080] bg-opacity-50 "></div>


            <div className="bg-herobg bg-center bg-no-repeat bg-cover flex justify-center items-center h-screen  overflow-hidden " >
                <div className='flex flex-col items-center  md:mx-10 pt-16 pb-12 px-2 md:px-6  max-h-[90vh] overflow-auto w-full max-w-[700px]  rounded-2xl bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]  relative'>
                    <div className='h-[50px] w-[50px] text-white rounded-full bg-[#47B0FF]  flex justify-center items-center absolute md:top-[45px] md:left-[30px]  top-6 left-6'>
                        <FaArrowLeft />
                    </div>
                    <div className='h-[50px] w-[50px] rounded-full bg-[#47B0FF] text-white  flex justify-center items-center absolute md:top-[45px] md:right-[30px] top-6 right-6'>
                        <FaMinus />
                    </div>


                    <div className='text-white w-full max-w-[540px]'>
                        <h1 className='text-3xl md:text-[50px] font-bold text-white text-center'>Admin Login</h1>
                        <p className='text-lg text-white mt-3 text-center'>Welcome back! Please enter your details</p>
                        <form action="" className='mt-[30px] md:mt-[51px] w-full max-w-[540px] px-6 md:px-0' onSubmit={handleSubmit}>
                            <div className={` flex flex-col gap-1 w-full`}>
                                <label className="text-xl font-semibold ">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 mb-4"
                                    required
                                    value={formData?.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={`col-span-2 flex flex-col gap-1 w-full`}>
                                <label className="text-xl font-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="************"
                                    className="border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3 mb-4"
                                    required
                                    value={formData?.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                className=" bg-white text-black w-full p-[14px] text-lg  rounded-md font-semibold"

                            >
                                {isLoading ? "Loading...":"Login"}
                                
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login
