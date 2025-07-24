'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import EnhancedBookingForm from '../EnhancedBookingForm';
import { FaArrowLeft, FaMinus } from 'react-icons/fa';
import { translations } from '@/app/translations';

const BookModal = ({ locale = 'en' }) => {
  const dispatch = useDispatch();
  const { showBookModal, bookingPrefill } = useSelector((state) => state.bookModal);
  const t = translations[locale] || translations.en;

  const handleClose = () => {
    dispatch(closeBookModal());
  };

  if (!showBookModal) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative flex flex-col items-center max-h-[90vh] overflow-auto w-full max-w-[700px] rounded-2xl bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] pt-16 pb-12 px-2 md:px-6">
        {/* Close Icons */}
        <div
          className="cursor-pointer h-[50px] w-[50px] text-white rounded-full bg-[#47B0FF] flex justify-center items-center absolute md:top-[45px] md:left-[30px] top-6 left-6"
          onClick={handleClose}
        >
          <FaArrowLeft />
        </div>
        <div
          className="cursor-pointer h-[50px] w-[50px] text-white rounded-full bg-[#47B0FF] flex justify-center items-center absolute md:top-[45px] md:right-[30px] top-6 right-6"
          onClick={handleClose}
        >
          <FaMinus />
        </div>

        <EnhancedBookingForm onClose={handleClose} locale={locale} translations={t} />
      </div>
    </div>
  );
};

export default BookModal;
