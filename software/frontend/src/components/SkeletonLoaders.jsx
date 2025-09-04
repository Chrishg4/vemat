import React from 'react';

// Skeleton para tablas
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {/* Encabezado */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {Array(columns).fill().map((_, i) => (
        <div key={`header-${i}`} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
    
    {/* Filas */}
    {Array(rows).fill().map((_, rowIndex) => (
      <div 
        key={`row-${rowIndex}`}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4"
      >
        {Array(columns).fill().map((_, colIndex) => (
          <div 
            key={`cell-${rowIndex}-${colIndex}`}
            className="h-6 bg-gray-100 dark:bg-gray-800 rounded"
          />
        ))}
      </div>
    ))}
  </div>
);

// Skeleton para gráficos
export const ChartSkeleton = ({ height = "300px" }) => (
  <div 
    className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
    style={{ height }}
  >
    <div className="h-full w-full flex items-center justify-center">
      <svg 
        className="w-12 h-12 text-gray-200 dark:text-gray-700" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    </div>
  </div>
);

// Spinner de carga
export const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-ia-primary rounded-full animate-spin`}
      />
    </div>
  );
};

// Skeleton for cards or key-value lists
export const CardSkeleton = ({ items = 5 }) => (
  <div className="animate-pulse space-y-4">
    {Array(items).fill().map((_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="h-4 bg-ia-border rounded w-1/4"></div>
        <div className="h-4 bg-ia-border bg-opacity-70 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

// Skeleton for MetricDisplay
export const MetricDisplaySkeleton = () => (
  <div className="p-4 bg-ia-card rounded-xl shadow-md flex flex-col items-center justify-center text-ia-text border border-ia-border animate-pulse transition-colors duration-500">
    <div className="w-16 h-16 mb-3 rounded-full bg-ia-border"></div>
    <div className="h-6 w-3/4 mb-2 bg-ia-border rounded"></div>
    <div className="h-10 w-1/2 mb-2 bg-ia-border rounded"></div>
    <div className="grid grid-cols-2 gap-2 text-center w-full">
      <div>
        <div className="h-4 w-1/2 mx-auto mb-1 bg-ia-border rounded"></div>
        <div className="h-5 w-3/4 mx-auto bg-ia-border rounded"></div>
      </div>
      <div>
        <div className="h-4 w-1/2 mx-auto mb-1 bg-ia-border rounded"></div>
        <div className="h-5 w-3/4 mx-auto bg-ia-border rounded"></div>
      </div>
    </div>
  </div>
);
