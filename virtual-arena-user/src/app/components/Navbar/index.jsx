'use client'
import { closeModal, openModal } from '@/Store/ReduxSlice/ModalSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaBars, FaRegHeart, FaMapMarkerAlt, FaClock, FaSearch } from "react-icons/fa";
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
import { fetchProducts } from '@/Store/ReduxSlice/productSlice';
import { FaRegCircleUser } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './Notification';
import { IoIosArrowDown } from "react-icons/io";
import LanguageSwitcher from '../common/LanguageSwitcher';
import { translations } from '@/app/translations';

const Navbar = ({ locale = 'en' }) => {
    // Get translations
    const t = translations[locale] || translations.en;
    
    // Define navigation structure
    const primaryNavItems = [
        { title: t.home, path: `/?locale=${locale}` },
        {
            title: t.experiences,
            path: `/experiences?locale=${locale}`,
            hasDropdown: true,
            dropdownItems: [
                { title: t.ufoSpaceship, path: `/experiences/ufo-spaceship?locale=${locale}`, description: '5 seats' },
                { title: t.vr360, path: `/experiences/vr-360?locale=${locale}`, description: '2 seats' },
                { title: t.vrBattle, path: `/experiences/vr-battle?locale=${locale}`, description: '2 players' },
                { title: t.vrWarrior, path: `/experiences/vr-warrior?locale=${locale}`, description: 'Kids - 2 players' },
                { title: t.vrCat, path: `/experiences/vr-cat?locale=${locale}`, description: 'Kids - 2 machines' },
                { title: t.freeRoaming, path: `/experiences/free-roaming-arena?locale=${locale}`, description: '34x49 feet, up to 10 players' },
                { title: t.photoBooth, path: `/gallery?locale=${locale}`, description: 'Photo experiences' },
            ]
        },
        { title: t.pricing, path: `/pricing?locale=${locale}` },
        { title: "Events & Parties", path: `/events?locale=${locale}` },
        { title: "Shop", path: `/merchandise?locale=${locale}` },
        { title: t.aboutUs, path: `/about?locale=${locale}` },
        { title: t.contactUs, path: `/contact?locale=${locale}` },
    ];

    const pathname = usePathname()
    const dispatch = useDispatch()
    const { showModal } = useSelector((state) => state.modal)
    const { showBookModal } = useSelector((state) => state.bookModal)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.userData)
    const { cart } = useSelector((state) => state.cart)
    const dropdownRefs = useRef([]);
    const userMenuRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false)
    const [showMobileSubmenu, setShowMobileSubmenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const { products: allProducts, status: productsStatus } = useSelector((state) => state.products);

    // Predefined pages for search suggestions
    const predefinedSearchItems = [
        { title: t.home, path: `/?locale=${locale}` },
        { title: t.experiences, path: `/experiences?locale=${locale}` },
        { title: t.pricing, path: `/pricing?locale=${locale}` },
        { title: 'Gallery', path: `/gallery?locale=${locale}` },
        { title: 'Shop', path: `/merchandise?locale=${locale}` },
    ];
    const router = useRouter()

    useEffect(() => {
        dispatch(fetchUserData());
        dispatch(fetchCart());
        dispatch(fetchProducts());
    }, []);

    // Compute live search suggestions when user types
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions([]);
            return;
        }
        const term = searchTerm.toLowerCase();

        const pageResults = predefinedSearchItems.filter(item =>
            item.title.toLowerCase().includes(term)
        );

        const productResults = (allProducts || [])
            .filter(p => p.name && p.name.toLowerCase().includes(term))
            .slice(0, 5)
            .map(p => ({
                title: p.name,
                path: `/merchandise/${p.product_id}?locale=${locale}`,
            }));

        setSuggestions([...pageResults.slice(0, 5), ...productResults]);
    }, [searchTerm, allProducts, locale]);

    // Handle body scroll lock when mobile menu is open
    useEffect(() => {
        if (showSidebar) {
            // Lock scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Unlock scroll
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSidebar]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close dropdowns when clicking outside
            if (!dropdownRefs.current.some(ref => ref && ref.contains(event.target))) {
                setActiveDropdown(null);
            }
            
            // Close user menu when clicking outside
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            
            // Close search input when clicking outside
            if (!event.target.closest('.search-container')) {
                setShowSearchInput(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if a path is active
    const isActivePath = (path) => {
        if (path === `/?locale=${locale}`) {
            return pathname === '/' || pathname === '';
        }
        return pathname.startsWith(path.split('?')[0]);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleUserMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMobileSubmenu = (index) => {
        setShowMobileSubmenu(showMobileSubmenu === index ? null : index);
    };

    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput);
        setSearchTerm('');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                router.push(`/search?q=${encodeURIComponent(searchTerm)}&locale=${locale}`);
                setShowSearchInput(false);
            }
        }
    };

    const handleSuggestionClick = (path) => {
        router.push(path);
        setShowSearchInput(false);
        setSearchTerm('');
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
        router.push(path);
        setShowSidebar(false);
        setActiveDropdown(null);
        setShowMobileSubmenu(null);
    };

    const toggleSidebar = () => {
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
            {/* Main navigation container */}
            <div className={`w-full ${scrolled ? 'bg-gradient-to-tr from-[#023B6299] to-[#49094F66]' : 'bg-[#0C1339]'} ${scrolled ? 'fixed' : 'sticky'} top-0 shadow-md z-20 transition-all duration-300 border-t-0`}>
                <div className="container mx-auto px-4">
                    {/* Top utility bar - Secondary Navigation */}
                    <div className="hidden md:flex justify-between items-center py-2 ">
                        {/* Location and Hours */}
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-[#DB1FEB]" />
                                <span className="text-white">8109 102 St NW, Edmonton, AB T6E 4A4</span>
                            </div>
                            <div className="flex items-center">
                                <FaClock className="mr-1 text-[#DB1FEB]" />
                                <span className="text-white">Mon-Sun: 10AM-10PM</span>
                            </div>
                        </div>
                        
                        {/* Right side secondary navigation */}
                        <div className="flex items-center space-x-5">
                            {/* Language Toggle */}
                            <LanguageSwitcher 
                                currentLocale={locale} 
                                showLabel={false}
                                buttonStyle="text" 
                                size="md"
                            />
                            
                            {/* Search */}
                            <div className="search-container relative">
                                <button 
                                    onClick={toggleSearchInput}
                                    className="text-white hover:text-[#DB1FEB]"
                                    aria-label="Search"
                                >
                                    <FaSearch />
                                </button>
                                <AnimatePresence>
                                    {showSearchInput && (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: '200px', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="absolute right-0 top-0 z-10"
                                        >
                                            <input
                                                type="text"
                                                placeholder={t.search}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full py-1 px-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-1 focus:ring-[#DB1FEB]"
                                                autoFocus
                                                onKeyDown={handleSearch}
                                            />
                                            {suggestions.length > 0 && (
                                                <ul className="absolute left-0 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {suggestions.map((item, idx) => (
                                                        <li
                                                            key={idx}
                                                            onClick={() => handleSuggestionClick(item.path)}
                                                            className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                                                        >
                                                            {item.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* Cart Icon for authenticated users */}
                            {isAuthenticated && (
                                <div className="relative">
                                    <Link href={`/cart?locale=${locale}`}>
                                        <div className="relative">
                                            <IoCartOutline size={20} className="text-white hover:text-[#DB1FEB]" />
                                            {cart?.length > 0 && (
                                                <span className="absolute -top-2 -right-2 h-4 w-4 text-xs bg-[#DB1FEB] text-white rounded-full flex justify-center items-center">
                                                    {cart.length}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            
                            {/* Login/Signup or User Account */}
                            {!isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => handleShowModal('LOGIN')} 
                                        className="text-sm text-white hover:text-[#DB1FEB] transition-colors navbar-button"
                                    >
                                        {t.login}
                                    </button>
                                    <span className="text-white">|</span>
                                    <button 
                                        onClick={() => handleShowModal('REGISTER')} 
                                        className="text-sm text-white hover:text-[#DB1FEB] transition-colors navbar-button"
                                    >
                                        {t.signup}
                                    </button>
                                </div>
                            ) : (
                                <div className="relative" ref={userMenuRef}>
                                    <button 
                                        onClick={toggleUserMenu}
                                        className="flex items-center text-sm text-white hover:text-[#DB1FEB] transition-colors"
                                    >
                                        <FaRegCircleUser className="mr-1" size={18} />
                                        <span>Account</span>
                                        <IoIosArrowDown className={`ml-1 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isMenuOpen && (
                                                                                            <motion.div
                                                    className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 shadow-lg rounded-lg z-40"
                                                    variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="py-2">
                                                    <Link href={`/wishlist?locale=${locale}`}>
                                                        <div className="flex items-center px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors">
                                                            <FaRegHeart size={16} className="mr-2" />
                                                            <span>{t.wishlist}</span>
                                                        </div>
                                                    </Link>
                                                    <Link href={`/bookings?locale=${locale}`}>
                                                        <div className="px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors">{t.bookings}</div>
                                                    </Link>
                                                    <Link href={`/orders?locale=${locale}`}>
                                                        <div className="px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors">{t.orders}</div>
                                                    </Link>
                                                    <Link href={`/tournaments?locale=${locale}`}>
                                                        <div className="px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors">{t.tournaments}</div>
                                                    </Link>
                                                    <button 
                                                        onClick={handleLogout} 
                                                        className="w-full text-left px-4 py-2 text-white hover:text-[#DB1FEB] transition-colors"
                                                    >
                                                        {t.logout}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                            
                            {/* Book Now button - always visible */}
                            <div>
                                <BookNowButton locale={locale} margin="" />
                            </div>
                        </div>
                    </div>

                    {/* Main navbar with logo and navigation */}
                    <div className="py-3 flex justify-between items-center">
                        {/* Logo */}
                        <Link href={`/?locale=${locale}`} className="flex-shrink-0">
                            <img 
                                src="/assets/logo.png" 
                                alt="Virtual Arena" 
                                className="h-10 md:h-12 w-auto object-contain" 
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center justify-center flex-grow">
                            {/* Primary Navigation */}
                            <nav className="flex items-center justify-center space-x-6 xl:space-x-8">
                                {primaryNavItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="relative"
                                        ref={el => dropdownRefs.current[index] = el}
                                    >
                                        {item.hasDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => toggleDropdown(index)}
                                                    className={`text-white text-sm xl:text-base font-medium hover:text-[#DB1FEB] flex items-center ${isActivePath(item.path) || activeDropdown === index ? 'text-[#DB1FEB] border-b-2 border-[#DB1FEB]' : ''}`}
                                                >
                                                    {item.title}
                                                    <IoIosArrowDown className={`ml-1 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === index && (
                                                        <motion.div
                                                            className="absolute left-0 mt-2 w-64 bg-black bg-opacity-90 shadow-lg rounded-lg z-40 py-2"
                                                            variants={dropdownVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {item.dropdownItems.map((subItem, subIndex) => (
                                                                <button
                                                                    key={subIndex}
                                                                    onClick={() => handleLink(subItem.path)}
                                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                                                                >
                                                                    <div className={`${isActivePath(subItem.path) ? 'text-[#DB1FEB]' : 'text-white'} hover:text-[#DB1FEB]`}>
                                                                        {subItem.title}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400">{subItem.description}</div>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleLink(item.path)}
                                                className={`text-white whitespace-nowrap text-sm xl:text-base font-medium hover:text-[#DB1FEB] text-wrap-balance ${isActivePath(item.path) ? 'text-[#DB1FEB] border-b-2 border-[#DB1FEB]' : ''}`}
                                            >
                                                {item.title}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile Navigation Controls */}
                        <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden">
                            {isAuthenticated && (
                                <div className="relative">
                                    <Link href={`/cart?locale=${locale}`}>
                                        <div className="relative">
                                            <IoCartOutline size={20} className="text-white" />
                                            {cart?.length > 0 && (
                                                <span className="absolute -top-2 -right-2 h-4 w-4 text-xs bg-[#DB1FEB] text-white rounded-full flex justify-center items-center">
                                                    {cart.length}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            
                            {/* User account icon for mobile */}
                            {isAuthenticated ? (
                                <button 
                                    onClick={() => setShowSidebar(true)}
                                    className="text-white"
                                >
                                    <FaRegCircleUser size={20} />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleShowModal('LOGIN')}
                                    className="text-white"
                                >
                                    <FaRegCircleUser size={20} />
                                </button>
                            )}
                            
                            {/* Use smaller button size on mobile */}
                            <BookNowButton locale={locale} margin="" size={locale === 'fr' ? 'compact' : 'small'} />
                            
                            <button 
                                onClick={toggleSidebar}
                                className="text-white p-1"
                                aria-label="Menu"
                            >
                                <FaBars size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 transition-transform duration-300 z-30 h-screen w-full max-w-[300px] bg-[#121212] px-6 py-8 overflow-y-auto ${showSidebar ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center mb-8">
                    <Link href={`/?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                        <img src="/assets/logo.png" alt="Logo" className="w-[140px] object-contain" />
                    </Link>
                    <button onClick={toggleSidebar} className="text-white">
                        <IoCloseCircleSharp size={24} />
                    </button>
                </div>
                
                {/* Language switcher */}
                <div className="flex justify-center mb-6">
                    <LanguageSwitcher 
                        currentLocale={locale} 
                        showLabel={true}
                        buttonStyle="pill" 
                        size="sm"
                    />
                </div>
                
                {/* Search input */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t.search}
                            className="w-full py-2 px-4 bg-gray-800 text-white rounded-full focus:outline-none"
                            onKeyDown={handleSearch}
                        />
                        <FaSearch className="absolute right-4 top-3 text-gray-400" />
                    </div>
                </div>
                
                {/* Mobile navigation items */}
                <nav className="flex flex-col space-y-4">
                    {primaryNavItems.map((item, index) => (
                        <div key={index}>
                            {item.hasDropdown ? (
                                <>
                                    <button
                                        onClick={() => toggleMobileSubmenu(index)}
                                        className={`flex items-center justify-between w-full text-white text-lg font-medium hover:text-[#DB1FEB] ${isActivePath(item.path) ? 'text-[#DB1FEB]' : ''}`}
                                    >
                                        <span>{item.title}</span>
                                        <IoIosArrowDown className={`transition-transform ${showMobileSubmenu === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showMobileSubmenu === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 mt-2 flex flex-col space-y-3">
                                                    {item.dropdownItems.map((subItem, subIndex) => (
                                                        <button
                                                            key={subIndex}
                                                            onClick={() => handleLink(subItem.path)}
                                                            className="text-left"
                                                        >
                                                            <div className={`${isActivePath(subItem.path) ? 'text-[#DB1FEB]' : 'text-white'} hover:text-[#DB1FEB]`}>
                                                                {subItem.title}
                                                            </div>
                                                            <div className="text-xs text-gray-400">{subItem.description}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleLink(item.path)}
                                    className={`text-white text-lg font-medium hover:text-[#DB1FEB] text-left ${isActivePath(item.path) ? 'text-[#DB1FEB]' : ''}`}
                                >
                                    {item.title}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>
                
                {/* Mobile user account section */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                    {isAuthenticated ? (
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-[#DB1FEB] font-medium mb-2">My Account</h3>
                            <Link href={`/wishlist?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                                <div className="text-white hover:text-[#DB1FEB]">{t.wishlist}</div>
                            </Link>
                            <Link href={`/bookings?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                                <div className="text-white hover:text-[#DB1FEB]">{t.bookings}</div>
                            </Link>
                            <Link href={`/orders?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                                <div className="text-white hover:text-[#DB1FEB]">{t.orders}</div>
                            </Link>
                            <Link href={`/tournaments?locale=${locale}`} onClick={() => setShowSidebar(false)}>
                                <div className="text-white hover:text-[#DB1FEB]">{t.tournaments}</div>
                            </Link>
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setShowSidebar(false);
                                }}
                                className="text-white hover:text-[#DB1FEB] text-left"
                            >
                                {t.logout}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <button 
                                onClick={() => {
                                    handleShowModal('LOGIN');
                                    setShowSidebar(false);
                                }} 
                                className="bg-transparent border border-[#DB1FEB] text-white py-2 px-4 rounded-full hover:bg-[#DB1FEB] transition-colors"
                            >
                                {t.login}
                            </button>
                            <button 
                                onClick={() => {
                                    handleShowModal('REGISTER');
                                    setShowSidebar(false);
                                }} 
                                className="bg-[#DB1FEB] text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors"
                            >
                                {t.signup}
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Business info */}
                <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-gray-400">
                    <div className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-[#DB1FEB]" />
                        <span>8109 102 St NW, Edmonton, AB T6E 4A4</span>
                    </div>
                    <div className="flex items-center">
                        <FaClock className="mr-2 text-[#DB1FEB]" />
                        <span>Mon-Sun: 10AM-10PM</span>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile sidebar */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20" 
                    onClick={toggleSidebar}
                />
            )}

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