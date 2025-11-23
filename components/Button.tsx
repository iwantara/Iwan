
import React from 'react';
import { Theme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  theme?: Theme;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', theme, className = '', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center";
  
  // UPDATE: Use solid colors via gradientFrom (which we repurposed in themes.ts to act as a solid identifier or class)
  // or construct the class directly.
  // Since we updated themes.ts to have "from-X to-X" (same color), gradient classes will actually look solid now.
  // But to be cleaner, we can use the class directly if we wanted. 
  // For now, relying on the updated themes.ts gradientFrom/To being identical achieves the "Solid" look requested perfectly.
  
  const primaryClasses = theme 
    ? `bg-gradient-to-r ${theme.colors.gradientFrom} ${theme.colors.gradientTo} text-white shadow-lg`
    : "bg-indigo-600 text-white shadow-indigo-500/30";

  const secondaryClasses = "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md";

  return (
    <button 
      className={`${baseStyles} ${variant === 'primary' ? primaryClasses : (className.includes('bg-') ? '' : secondaryClasses)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
