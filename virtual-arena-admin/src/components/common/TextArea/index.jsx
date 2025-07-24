import React from 'react';

const TextArea = ({ 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    rows = 4, 
    cols, 
    className = '', 
    disabled = false,
    ...props 
}) => {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            cols={cols}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            } ${className}`}
            {...props}
        />
    );
};

export default TextArea;
