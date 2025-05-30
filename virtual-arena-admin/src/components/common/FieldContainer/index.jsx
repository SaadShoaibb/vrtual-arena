"use client"
import React from 'react';

const FieldContainer = ({ label, htmlFor, children, className }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-gray1 text-sm font-bold mb-2" htmlFor={htmlFor}>
                    {label}
                </label>
            )}
            {children}
        </div>
    );
};

export default FieldContainer;