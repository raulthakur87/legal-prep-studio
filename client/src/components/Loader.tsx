import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};
