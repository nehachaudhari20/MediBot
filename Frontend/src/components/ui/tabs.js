import React from 'react';

const Tabs = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`tabs ${className}`}
      {...props}
    />
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`tabs-list ${className}`}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className = '', value, active, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`tabs-trigger ${active ? 'tabs-trigger-active' : ''} ${className}`}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className = '', value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`tabs-content ${className}`}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };