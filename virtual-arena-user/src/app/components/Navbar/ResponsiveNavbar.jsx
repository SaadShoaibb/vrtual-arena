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
import { IoIosArrowDown } from "react-icons/io";
import LanguageToggle from '../common/LanguageToggle';
import { translations } from '@/app/translations';

const ResponsiveNavbar = ({ locale = 'en' }) => {
    // Get translations
    const t = translations[locale] || translations.en;
    
    const navBtn = [
        { title: t.home, path: `/?locale=${locale}` },
        { title: t.aboutUs, path: `/about?locale=${locale}` },
        { title: t.pricing, path: `/pricing?locale=${locale}` },
    ];

    // Items in More dropdown
    const moreItems = [
        { title: t.deals, path: `/deals?locale=${locale}` },
        { title: t.contactUs, path: `/contact?locale=${locale}` },
        { title: t.merchandise, path: `/merchandise?locale=${locale}` }
    ];

    // VR experiences for dropdown menu
    const experiences = [
        { title: t.ufoSpaceship, path: `/experiences/ufo-spaceship?locale=${locale}` },
        { title: t.vr360, path: `/experiences/vr-360?locale=${locale}` },
        { title: t.vrBattle, path: `/experiences/vr-battle?locale=${locale}` },
        { title: t.vrWarrior, path: `/experiences/vr-warrior?locale=${locale}` },
        { title: t.vrCat, path: `/experiences/vr-cat?locale=${locale}` },
        { title: t.freeRoaming, path: `/experiences/free-roaming-arena?locale=${locale}` },
        { title: t.photoBooth, path: `/gallery?locale=${locale}` },
    ];

    const pathname = usePathname()
    const dispatch = useDispatch()
    const { showModal } = useSelector((state) => state.modal)
    const { showBookModal } = useSelector((state) => state.bookModal)
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.userData)
    const { cart } = useSelector((state) => state.cart)
    const menuRef = useRef(null);
    const moreDropdownRef = useRef(null);
    const experienceDropdownRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false)
    const [showExperiences, setShowExperiences] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
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
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
                setShowMoreDropdown(false);
            }
            if (experienceDropdownRef.current && !experienceDropdownRef.current.contains(event.target)) {
                setShowExperienceDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMoreDropdown = () => {
        setShowMoreDropdown(!showMoreDropdown);
    };

    const toggleExperienceDropdown = () => {
        setShowExperienceDropdown(!showExperienceDropdown);
    };

    const toggleMegaMenu = () => {
        setShowMegaMenu(!showMegaMenu);
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    const megaMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
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
        router.push(path);
        setShowSidebar(false);
        setShowMoreDropdown(false);
        setShowExperienceDropdown(false);
        setShowMegaMenu(false);
    };

    const handelShowSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token')
            dispatch(clearAuth());
            toast.success(t.logoutSuccess)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='w-full bg-gradient-to-tr sticky top-0 shadow-md from-[#023B6299] to-[#49094F66] z-30'>
                <div className='w-full mx-auto max-w-[1600px] pt-[15px] pb-[15px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='flex items-center gap-4 sm:gap-[42px]'>
                        {/* Logo */}
                        <Link href={`/?locale=${locale}`}>
                            <img src="/assets/logo.png" alt="Logo" className='w-[120px] h-[40px] md:w-[150px] md:h-[50px] lg:w-[180px] lg:h-[60px] object-contain' />
                        </Link>

                        {/* Main Nav buttons - Desktop */}
                        <div className='hidden lg:flex items-center gap-4 xl:gap-6'>
                            {navBtn.map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleLink(btn.path)}
                                    className={`text-white text-base xl:text-lg font-semibold border-b-2 whitespace-nowrap ${pathname === btn.path ? 'border-[#DB1FEB]' : 'border-transparent'}`}
                                >
                                    {btn.title}
                                </button>
                            ))}
                            
                            {/* Experience dropdown - Desktop */}
                            <div className="relative" ref={experienceDropdownRef}>
                                <button 
                                    onClick={toggleExperienceDropdown}
                                    className={`text-white text-base xl:text-lg font-semibold border-b-2 whitespace-nowrap ${pathname.includes('/experiences') ? 'border-[#DB1FEB]' : 'border-transparent'} flex items-center`}
                                >
                                    {t.experience} <IoIosArrowDown className="ml-1" />
                                </button>
                                <AnimatePresence>
                                    {showExperienceDropdown && (
                                        <motion.div
                                            className="absolute top-full left-0 bg-black bg-opacity-90 shadow-lg rounded-lg mt-2 w-52 z-50 py-2"
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.2 }}
                                        >
                                            {experiences.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleLink(item.path)}
                                                    className="block px-4 py-2 text-white hover:bg-gray-800 w-full text-left"
                                                >
                                                    {item.title}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* More dropdown - Desktop */}
                            <div className="relative" ref={moreDropdownRef}>
                                <button 
                                    onClick={toggleMoreDropdown}
                                    className={`text-white text-base xl:text-lg font-semibold border-b-2 whitespace-nowrap border-transparent flex items-center`}
                                >
                                    {t.more} <IoIosArrowDown className="ml-1" />
                                </button>
                                <AnimatePresence>
                                    {showMoreDropdown && (
                                        <motion.div
                                            className="absolute top-full left-0 bg-black bg-opacity-90 shadow-lg rounded-lg mt-2 w-52 z-50 py-2"
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.2 }}
                                        >
                                            {moreItems.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleLink(item.path)}
                                                    className="block px-4 py-2 text-white hover:bg-gray-800 w-full text-left"
                                                >
                                                    {item.title}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* Language Toggle in nav items - Desktop */}
                            <div className="ml-2">
                                <LanguageToggle />
                            </div>
                        </div>
                        
                        {/* Mega Menu Button - Tablet */}
                        <div className="hidden md:block lg:hidden">
                            <button 
                                onClick={toggleMegaMenu}
                                className="text-white text-base font-semibold flex items-center"
                            >
                                Menu <IoIosArrowDown className="ml-1" />
                            </button>
                            
                            {/* Mega Menu - Tablet */}
                            <AnimatePresence>
                                {showMegaMenu && (
                                    <>
                                        <motion.div
                                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={toggleMegaMenu}
                                        />
                                        <motion.div
                                            className="absolute top-full left-0 right-0 bg-black bg-opacity-95 shadow-lg mt-4 mx-4 z-50 rounded-lg overflow-hidden"
                                            variants={megaMenuVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="grid grid-cols-2 gap-4 p-6">
                                                <div>
                                                    <h3 className="text-[#DB1FEB] font-bold mb-4 text-lg">Navigation</h3>
                                                    <div className="flex flex-col space-y-3">
                                                        {navBtn.map((btn, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleLink(btn.path)}
                                                                className="text-white hover:text-[#DB1FEB] text-left"
                                                            >
                                                                {btn.title}
                                                            </button>
                                                        ))}
                                                        {moreItems.map((item, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleLink(item.path)}
                                                                className="text-white hover:text-[#DB1FEB] text-left"
                                                            >
                                                                {item.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-[#DB1FEB] font-bold mb-4 text-lg">{t.experience}</h3>
                                                    <div className="flex flex-col space-y-3">
                                                        {experiences.map((exp, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleLink(exp.path)}
                                                                className="text-white hover:text-[#DB1FEB] text-left"
                                                            >
                                                                {exp.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-900 p-4 flex justify-between items-center">
                                                <LanguageToggle />
                                                <button 
                                                    onClick={toggleMegaMenu}
                                                    className="text-white hover:text-[#DB1FEB]"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className='flex items-center gap-3 md:gap-5'>
                        {isAuthenticated ? (
                            <>
                                <div className='relative'>
                                    <span className='absolute -top-2 -right-2 h-5 w-5 text-xs bg-white text-black rounded-full flex justify-center items-center'>
                                        {cart?.length}
                                    </span>
                                    <Link href={`/cart?locale=${locale}`}>
                                        <IoCartOutline size={24} className="text-white cursor-pointer" />
                                    </Link>
                                </div>

                                <NotificationDropdown />

                                <div className='relative'>
                                    <FaRegCircleUser
                                        size={24}
                                        className="text-white cursor-pointer"
                                        onClick={toggleMenu}
                                    />
                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                ref={menuRef}
                                                className='absolute right-0 mt-2 w-48 bg-black bg-opacity-90 shadow-lg rounded-lg z-50'
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className='py-2'>
                                                    <Link href={`/wishlist?locale=${locale}`}>
                                                        <div className='flex items-center px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors'>
                                                            <FaRegHeart size={18} className="mr-2" />
                                                            <span>{t.wishlist}</span>
                                                        </div>
                                                    </Link>
                                                    <Link href={`/bookings?locale=${locale}`}>
                                                        <div className='px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors'>{t.bookings}</div>
                                                    </Link>
                                                    <Link href={`/orders?locale=${locale}`}>
                                                        <div className='px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors'>{t.orders}</div>
                                                    </Link>
                                                    <Link href={`/tournaments?locale=${locale}`}>
                                                        <div className='px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors'>{t.tournaments}</div>
                                                    </Link>
                                                    <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors'>
                                                        {t.logout}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className='hidden md:flex gap-4 items-center'>
                                <button onClick={() => handleShowModal('LOGIN')} className='text-white text-base lg:text-lg font-semibold whitespace-nowrap'>{t.login}</button>
                                <span className='text-white'>|</span>
                                <button onClick={() => handleShowModal('REGISTER')} className='text-white text-base lg:text-lg font-semibold whitespace-nowrap'>{t.signup}</button>
                            </div>
                        )}

                        <BookNowButton locale={locale} />
                        <FaBars className='text-white cursor-pointer' size={24} onClick={handelShowSidebar} />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 transition-transform duration-300 z-40 min-h-screen w-full max-w-[300px] bg-blackish px-6 py-8 overflow-y-auto ${showSidebar ? "translate-x-0" : "translate-x-full"}`}>
                <IoCloseCircleSharp className='text-white absolute top-4 right-4 cursor-pointer' size={28} onClick={handelShowSidebar} />
                
                {/* Logo inside mobile menu */}
                <div className='flex justify-center mb-8'>
                    <Link href={`/?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                        <img src="/assets/logo.png" alt="Logo" className='w-[140px] object-contain' />
                    </Link>
                </div>
                
                {/* Language toggle in mobile menu - prominent position */}
                <div className="flex justify-center mb-6">
                    <LanguageToggle />
                </div>
                
                <div className='flex flex-col gap-5 items-start'>
                    {/* Main nav items in sidebar */}
                    {navBtn.map((btn, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleLink(btn.path)} 
                            className='text-white text-lg font-semibold hover:text-[#DB1FEB] transition-colors'
                        >
                            {btn.title}
                        </button>
                    ))}
                    
                    {/* Experience dropdown in sidebar */}
                    <div className="w-full">
                        <button 
                            onClick={() => setShowExperiences(!showExperiences)} 
                            className='text-white text-lg font-semibold hover:text-[#DB1FEB] transition-colors flex items-center'
                        >
                            {t.experience}
                            <IoIosArrowDown className={`ml-2 transition-transform duration-300 ${showExperiences ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showExperiences && (
                            <div className='mt-2 ml-4 flex flex-col gap-3'>
                                {experiences.map((exp, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLink(exp.path)}
                                        className="text-white text-base hover:text-[#DB1FEB] transition-colors text-left"
                                    >
                                        {exp.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* More items in sidebar */}
                    {moreItems.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleLink(item.path)}
                            className='text-white text-lg font-semibold hover:text-[#DB1FEB] transition-colors'
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
                
                {!isAuthenticated && (
                    <div className='flex gap-6 mt-8 justify-center text-lg font-semibold'>
                        <button onClick={() => { handleShowModal('LOGIN'); setShowSidebar(false); }} className='text-white hover:text-[#DB1FEB] transition-colors'>{t.login}</button>
                        <span className='text-white'>|</span>
                        <button onClick={() => { handleShowModal('REGISTER'); setShowSidebar(false); }} className='text-white hover:text-[#DB1FEB] transition-colors'>{t.signup}</button>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {showSidebar && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={handelShowSidebar} />}

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

export default ResponsiveNavbar; 