"use client"
import React from 'react';

const FieldContainer = ({ label, htmlFor, children, className }) => {
    return (
        <div className={`mb-4 w-full flex flex-col ${className}`}>
            {label && (
                <label className="text-xl font-semibold mb-1" htmlFor={htmlFor}>
                    {label}
                </label>
            )}
            {children}
        </div>
    );
};

export default FieldContainer;