"use client"
import React from 'react';

const Checkbox = ({ name, checked, onChange, label, className,htmlFor }) => {
    return (

        <div className={`mb-4 ${className}`}>
            <label className="block text-gray1 text-sm font-bold mb-2" htmlFor={htmlFor}>
                {label}
            </label>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="mr-2 leading-tight"
            />
            <span className="text-sm text-gray1">Active</span>
        </div>

    );
};

export default Checkbox;