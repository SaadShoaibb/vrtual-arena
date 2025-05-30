'use client'
import React from 'react';

const Form = ({ onSubmit, children, className }) => {
    return (
        <form onSubmit={onSubmit} className={className}>
            {children}
        </form>
    );
};

export default Form;