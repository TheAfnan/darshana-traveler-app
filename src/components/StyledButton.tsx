import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface StyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-orange-600 hover:bg-orange-700 text-white',
  secondary: 'bg-teal-700 hover:bg-teal-800 text-white',
  outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
  ghost: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const StyledButton: React.FC<StyledButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'rounded-full font-semibold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default StyledButton;
