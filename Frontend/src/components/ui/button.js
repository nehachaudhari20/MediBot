import React from 'react';

const Button = React.forwardRef(({ 
  className = '', 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'default':
        return 'btn-primary';
      case 'destructive':
        return 'btn-destructive';
      case 'outline':
        return 'btn-outline';
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'btn-ghost';
      case 'link':
        return 'btn-link';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'default':
        return '';
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'icon':
        return 'btn-icon';
      default:
        return '';
    }
  };
  
  return (
    <button
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };