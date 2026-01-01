import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) => {
    const baseStyles = 'font-medium rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-gold-500 text-white hover:bg-gold-600 hover:shadow-luxury-hover',
        secondary: 'bg-maroon-500 text-white hover:bg-maroon-600 hover:shadow-luxury-hover',
        outline: 'border-2 border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-white',
        ghost: 'text-gold-700 hover:bg-gold-50',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3 text-base',
        lg: 'px-10 py-4 text-lg',
    };

    return (
        <button
            className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};
