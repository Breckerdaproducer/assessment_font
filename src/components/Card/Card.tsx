import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm ${className}`}>
      {title && <h2 className="text-xl font-bold mb-5 text-slate-900">{title}</h2>}
      {children}
    </div>
  );
}
