'use client'
import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, required, className ,accept,multiple,disabled}) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray1 leading-tight focus:outline-none focus:shadow-outline bg-transparent ${className}`}
        />
    );
};

export default Input;