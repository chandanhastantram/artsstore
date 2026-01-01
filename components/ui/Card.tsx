import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg shadow-luxury transition-all duration-300',
                hover && 'hover:shadow-luxury-hover hover:-translate-y-1 cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    return <div className={clsx('p-6 border-b border-gray-100', className)}>{children}</div>;
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    return <div className={clsx('p-6', className)}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    return <div className={clsx('p-6 border-t border-gray-100', className)}>{children}</div>;
};
