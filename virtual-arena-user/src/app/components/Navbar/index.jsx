'use client'
import { closeModal, openModal } from '@/Store/ReduxSlice/ModalSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaBars, FaRegHeart } from "react-icons/fa";
import { IoCartOutline, IoCloseCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import AuthModel from '../AuthModal';
import AuthComponents from '../AuthComponents';
import { clearAuth } from '@/Store/ReduxSlice/userSlice';
import { fetchUserData } from '@/Store/Actions/userActions';
import toast from 'react-hot-toast';
import { closeBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import BookingForm from '../BookingForm';
import BookNowButton from '../common/BookNowButton';
import { fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { FaRegCircleUser } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './Notification';

const Navbar = () => {
    const navBtn = [
        { title: "Home", path: '/' },
        { title: "About Us", path: '/about' },
        { title: "Experience", path: '/experience' },
        { title: "Pricing", path: '/pricing' },
        { title: "Deals & Membership", path: '/deals' },
        { title: "Contact Us", path: '/contact' },
        { title: "Merchandise", path: '/merchandise' }
    ];

    const pathname = usePathname()
    const dispatch = useDispatch()
    const { showModal } = useSelector((state) => state.modal)
    const { showBookModal } = useSelector((state) => state.bookModal)
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.userData)
    const { cart } = useSelector((state) => state.cart)
    const menuRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false)
    const router = useRouter()

    useEffect(() => {
        dispatch(fetchUserData())
        dispatch(fetchCart());
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    const handleShowModal = (mode) => {
        dispatch(openModal(mode))
    }

    const handleCloseModal = () => {
        dispatch(closeModal())
        localStorage.removeItem('booking_id')
    }

    const handleCloseBookModal = () => {
        dispatch(closeBookModal())
        localStorage.removeItem('booking_id')
    }

    const handleLink = (path) => {
        if (path === '/experience' || path === '/about') {
            setTimeout(() => {
                const element = document.getElementById(path === '/experience' ? 'experience' : 'about');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            router.push('/');
        } else {
            router.push(path);
        }
        setShowSidebar(false);
    };

    const handelShowSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token')
            dispatch(clearAuth());
            toast.success("Logout Successfully")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='w-full bg-gradient-to-tr sticky top-0 shadow-md from-[#023B6299] to-[#49094F66] z-30'>
                <div className='w-full mx-auto max-w-[1600px] pt-[15px] pb-[10px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='flex items-center gap-4 sm:gap-[42px]'>
                        {/* Logo - visible only on md and up */}
                        <img src="/assets/logo.png" alt="Logo" className='hidden sm:block w-[150px] md:w-[199px] h-[60px] md:h-[85px]' />

                        {/* Nav buttons */}
                        <div className='hidden xl:flex gap-6'>
                            {navBtn.slice(0, 4).map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleLink(btn.path)}
                                    className={`text-white text-lg font-semibold ${pathname === btn.path ? 'border-b-2 border-[#DB1FEB]' : ''}`}
                                >
                                    {btn.title}
                                </button>
                            ))}
                            <div className="relative">
                                <button onClick={() => setShowDropdown(!showDropdown)} className="text-white text-lg font-semibold">
                                    More ▼
                                </button>
                                {showDropdown && (
                                    <div className="absolute top-full left-0 bg-black shadow-lg rounded-lg mt-2 w-52 z-50">
                                        {navBtn.slice(4).map((btn, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    handleLink(btn.path);
                                                    setShowDropdown(false);
                                                }}
                                                className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                                            >
                                                {btn.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className='flex items-center gap-5'>
                        {isAuthenticated ? (
                            <>
                                <div className='relative'>
                                    <span className='absolute -top-2 -right-2 h-5 w-5 text-xs bg-white text-black rounded-full flex justify-center items-center'>
                                        {cart?.length}
                                    </span>
                                    <Link href={'/cart'}>
                                        <IoCartOutline size={26} className="text-white cursor-pointer" />
                                    </Link>
                                </div>

                                <NotificationDropdown />

                                <div className='relative'>
                                    <FaRegCircleUser
                                        size={26}
                                        className="text-white cursor-pointer"
                                        onClick={toggleMenu}
                                    />
                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                ref={menuRef}
                                                className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50'
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className='py-2'>
                                                    <Link href={'/wishlist'}>
                                                        <div className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'>
                                                            <FaRegHeart size={20} className="mr-2" />
                                                            <span>Wishlist</span>
                                                        </div>
                                                    </Link>
                                                    <Link href={'/bookings'}>
                                                        <div className='px-4 py-2 hover:bg-gray-100 text-gray-700'>Bookings</div>
                                                    </Link>
                                                    <Link href={'/orders'}>
                                                        <div className='px-4 py-2 hover:bg-gray-100 text-gray-700'>Orders</div>
                                                    </Link>
                                                    <Link href={'/tournaments'}>
                                                        <div className='px-4 py-2 hover:bg-gray-100 text-gray-700'>Tournaments</div>
                                                    </Link>
                                                    <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'>
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className='hidden md:flex gap-4 items-center'>
                                <button onClick={() => handleShowModal('LOGIN')} className='text-white text-lg font-semibold'>Login</button>
                                <span className='text-white'>|</span>
                                <button onClick={() => handleShowModal('REGISTER')} className='text-white text-lg font-semibold'>Signup</button>
                            </div>
                        )}

                        <BookNowButton />
                        <FaBars className='text-white xl:hidden' size={28} onClick={handelShowSidebar} />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 transition-transform duration-300 z-40 min-h-screen w-full max-w-sm bg-blackish px-6 py-8 ${showSidebar ? "translate-x-0" : "translate-x-full"}`}>
                <IoCloseCircleSharp className='text-white absolute top-4 right-4' size={28} onClick={handelShowSidebar} />
                {/* Logo inside mobile menu */}
                <div className='flex justify-center mb-8 sm:hidden'>
                    <img src="/assets/logo.png" alt="Logo" className='w-[160px]' />
                </div>
                <div className='flex flex-col gap-6'>
                    {navBtn.map((btn, i) => (
                        <button key={i} onClick={() => handleLink(btn.path)} className='text-white text-lg font-semibold'>
                            {btn.title}
                        </button>
                    ))}
                </div>
                {!isAuthenticated && (
                    <div className='flex gap-6 mt-8 justify-center text-lg font-semibold'>
                        <button onClick={() => handleShowModal('LOGIN')} className='text-white'>Login</button>
                        <span className='text-white'>|</span>
                        <button onClick={() => handleShowModal('REGISTER')} className='text-white'>Signup</button>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {showSidebar && <div className="fixed inset-0 bg-black bg-opacity-30 z-30" onClick={handelShowSidebar} />}

            {/* Modals */}
            {showModal && (
                <AuthModel onClose={handleCloseModal}>
                    <AuthComponents />
                </AuthModel>
            )}
            {showBookModal && (
                <AuthModel onClose={handleCloseBookModal}>
                    <BookingForm />
                </AuthModel>
            )}
        </>
    );
}

export default Navbar;
