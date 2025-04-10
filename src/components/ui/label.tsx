import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <label
        className={`block text-sm font-medium text-gray-700 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label'; 