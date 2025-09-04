import React from 'react';
import { TableSkeleton } from './SkeletonLoaders';
import { useTheme } from '../context/ThemeContext';

const ResponsiveTable = ({ 
  columns, 
  data, 
  loading, 
  noDataMessage = "No hay datos disponibles",
  actions,
  onRowClick,
  containerClassName = ""
}) => {
  const { theme } = useTheme();

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-ia-text-secondary">
        {noDataMessage}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${containerClassName}`}>
      <table className="min-w-full divide-y divide-ia-border">
        <thead className="bg-ia-card-header">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-ia-text-secondary uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions && <th scope="col" className="relative px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-ia-border bg-ia-card">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${
                onRowClick ? 'cursor-pointer' : ''
              } hover:bg-ia-card-hover transition-colors`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-ia-text"
                >
                  {column.render ? column.render(row) : row[column.field]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
