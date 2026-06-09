import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-slate-500">{label}</label>}
      <input 
        className={`p-2 border rounded-md bg-white text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${error ? 'border-red-500' : 'border-slate-200'}`} 
        {...props} 
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
