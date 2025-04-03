import React from 'react';

const Label = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <label
      className={`label ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };