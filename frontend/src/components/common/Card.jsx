import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-custom';
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };
  
  const hoverClasses = hover 
    ? 'transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg' 
    : '';

  return (
    <div 
      className={`${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 