'use client'
import Link from 'next/link'
import React from 'react'
const Merchandises = () => {
    const data=[
        {
            id:1,
            img:'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9vZGllfGVufDB8fDB8fHww'
        },
        {
            id:2,
            img:'https://plus.unsplash.com/premium_photo-1673827311290-d435f481152e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9vZGllfGVufDB8fDB8fHww'
        },
        {
            id:3,
            img:'https://images.unsplash.com/photo-1579572331145-5e53b299c64e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9vZGllfGVufDB8fDB8fHww'
        },
        {
            id:4,
            img:'https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id:5,
            img:'https://plus.unsplash.com/premium_photo-1681493944219-44118cf7754d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG9vZGllfGVufDB8fDB8fHww'
        },
        {
            id:6,
            img:'https://images.unsplash.com/photo-1542556398-95fb5b9f9b48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVnc3xlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id:7,
            img:'https://plus.unsplash.com/premium_photo-1668972393936-31fea424d8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXVnc3xlbnwwfHwwfHx8MA%3D%3D    '
        },
        {
            id:8,
            img:'https://images.unsplash.com/photo-1610387695018-3a90bf21c575?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bXVnc3xlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id:9,
            img:'https://images.unsplash.com/photo-1520031473529-2c06dea61853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG11Z3N8ZW58MHx8MHx8fDA%3D'
        },
     
    ]
    return (
        <div id='Merchandises' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y  py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 md:grdc2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10'>
                    {data?.map((data, i) => (


                        <div key={data.id} className='rounded-xl overflow-hidden'>
                            <Link href={`/merchandise/${data.id}`}><img src={data.img} alt="" className='h-[300px] w-full' /></Link>
                            <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] p-2.5 flex gap-2.5 items-center'>
                                <div className='bg-white h-11 w-[72px] rounded-md flex justify-center items-center'>
                                    <h1 className='text-black text-xl font-bold'>-40%</h1>

                                </div>
                                <h1 className='text-xl text-white line-through'>$69.99 </h1><span className='text-xl text-white font-bold '>$41.99</span>
                            </div>
                            <div className=' flex items-center justify-between  bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                <div className='flex items-center justify-center gap-2 bg-white w-[78%] py-4'>

                                    <img src="/icons/cart.png" alt="" />
                                    <h1 className='text-lg font-semibold'>Add To Cart</h1>
                                </div>
                                <div className='py-4 w-[20%] bg-white flex justify-center'>
                                    <img src="/icons/heart.png" alt="" />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default Merchandises
