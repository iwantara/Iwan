
import React from 'react';
import { Theme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  theme?: Theme;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', theme, className = '', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center";
  
  // PRIMARY BUTTON LOGIC:
  // Gunakan background dari `gradientFrom` (sekarang solid).
  // Gunakan text color dari `buttonTextColor` (agar kontras).
  const primaryClasses = theme 
    ? `${theme.colors.gradientFrom} ${theme.colors.buttonTextColor} shadow-lg`
    : "bg-indigo-600 text-white shadow-indigo-500/30";

  // SECONDARY BUTTON:
  // Putih dengan border tipis, teks abu-abu gelap.
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
