'use client'
import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, required, className,disabled,min }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`border rounded-lg text-lg bg-transparent focus:outline-none placeholder:text-white p-3  ${className}`}
            min={min}
        />
    );
};

export default Input;