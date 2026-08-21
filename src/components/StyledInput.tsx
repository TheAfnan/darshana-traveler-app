import React from 'react';

export type InputVariant = 'default' | 'outline';

interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  helpText?: string;
}

const variantStyles: Record<InputVariant, string> = {
  default: 'w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition',
  outline: 'w-full px-4 py-3 rounded-lg border-2 border-stone-300 focus:border-orange-600 outline-none transition',
};

export const StyledInput: React.FC<StyledInputProps> = ({
  variant = 'default',
  label,
  error,
  helpText,
  className = '',
  ...props
}) => {
  const variantClass = variantStyles[variant];

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`${variantClass} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helpText && !error && (
        <span className="text-xs text-stone-500">{helpText}</span>
      )}
    </div>
  );
};

export default StyledInput;
