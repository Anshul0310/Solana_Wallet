import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    ...props
}) => {
    const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

    return (
        <button
            className={`${baseClass} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
};
