import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'glass';

interface StyledCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white rounded-xl shadow-md border border-stone-200',
  elevated: 'bg-white rounded-xl shadow-lg border border-stone-100',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
};

export const StyledCard: React.FC<StyledCardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantClass = variantStyles[variant];
  const baseStyles = 'p-6 transition hover:shadow-lg';

  return (
    <div
      {...props}
      className={`${baseStyles} ${variantClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default StyledCard;
