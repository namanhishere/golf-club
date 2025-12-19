import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary:
      'bg-primary-accent text-white hover:bg-secondary-accent active:bg-primary focus:ring-primary-accent hover:shadow-lg hover:shadow-primary-accent/30',
    secondary:
      'bg-white text-txt-dark border border-txt-dark hover:bg-txt-placeholder/10 active:bg-txt-dark active:text-txt-light focus:ring-txt-dark',
    third:
      'bg-black text-txt-light hover:bg-txt-dark/90 active:bg-txt-light active:text-txt-dark focus:ring-txt-dark',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 border border-transparent',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 hover:text-gray-900',
  };

  const sizes = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'third', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;