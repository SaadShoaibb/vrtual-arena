"use client"
import React from 'react';

const Select = ({ name, value, onChange, options, required, className }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray1 leading-tight focus:outline-none focus:shadow-outline bg-transparent ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} className="text-black">
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;