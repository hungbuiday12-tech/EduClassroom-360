import React from 'react';

interface BrandLogoProps {
  sizeClass?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  sizeClass = 'w-8 h-8 sm:w-9 sm:h-9',
  className = '',
}) => {
  const baseUrl = import.meta.env.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const src = `${normalizedBase}assets/aistudio/image_0883e005.png`;

  return (
    <div
      className={`${sizeClass} shrink-0 rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex items-center justify-center ${className}`}
    >
      <img
        src={src}
        alt="Synapse Logo"
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
};
