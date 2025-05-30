"use client"; // Mark as a Client Component

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDropdown } from "@/Store/ReduxSlice/dropdownSlice";

const SidebarDropdown = ({ isSidebarOpen, title, icon, items, dropdownId }) => {
    const dispatch = useDispatch();
    const openDropdownId = useSelector((state) => state.dropdown.openDropdownId); // Get the open dropdown ID from Reduconst pathname = usePathname(); // Get the current route
    const isOpen = openDropdownId === dropdownId;
    const pathname = usePathname()
    const handleToggleDropdown = () => {
        dispatch(toggleDropdown({ dropdownId })); // Toggle this dropdown
      };

  return (
    <li className={`${isOpen ? ' text-white p-4 pb-0':'p-4 '}`}>
      <div
        onClick={handleToggleDropdown}
        className={`flex items-center cursor-pointer `}
      >
        <span>{isSidebarOpen ? 
        <span className={`flex gap-2 items-center   leading-none`}>
            {icon}
        {title} 
            </span>
        : icon}</span>
        {isSidebarOpen && (
          <span className="ml-auto transition-transform duration-300">
            {isOpen ?<FaAngleDown />: <FaAngleRight />}
          </span>
        )}
      </div>

      {/* Dropdown Items */}
      <AnimatePresence>
        {isSidebarOpen && isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`pl-8   ${isOpen ? ' ':''}`}
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                className={`py-4  rounded ${
                  pathname === item.href ? " text-gradiant" : ""
                }`}
              >
                <Link onClick={(e) => e.stopPropagation()}  href={item.href} className="flex items-center">
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default SidebarDropdown;