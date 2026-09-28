import React from 'react';

export type AppColumn = {
  label: React.ReactNode;
  flex?: number;
  width?: number | string;
};

export type AppDataRow = {
  id: string | number;
  cells: React.ReactNode[];
};

type AppDataTableProps = {
  columns: AppColumn[];
  rows: AppDataRow[];
  headingRowColor?: string;
};

export default function AppDataTable({ columns, rows, headingRowColor }: AppDataTableProps) {
  // Helper to determine style for a column/cell
  const getColumnStyle = (col: AppColumn) => {
    if (col.width !== undefined) {
      return { width: col.width, flexShrink: 0, flexGrow: 0 };
    }
    return { flex: col.flex ?? 1 };
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Table Header */}
      <div 
        className="flex items-center border-b border-border-theme shrink-0"
        style={{ backgroundColor: headingRowColor || 'var(--color-surface-elevated)' }}
      >
        {columns.map((col, idx) => (
          <div 
            key={idx}
            className="px-4 py-3.5 flex items-center justify-start text-label text-text-secondary uppercase tracking-wider"
            style={getColumnStyle(col)}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Scrollable Table Body */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        {rows.length > 0 ? (
          rows.map((row) => (
            <div 
              key={row.id}
              className="flex items-center border-b border-divider bg-surface hover:bg-surface-elevated/50 transition-colors"
            >
              {row.cells.map((cell, idx) => {
                const col = columns[idx];
                return (
                  <div 
                    key={idx}
                    className="px-4 py-4 flex items-center justify-start text-bodyMedium text-text-primary"
                    style={col ? getColumnStyle(col) : { flex: 1 }}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-text-secondary text-bodyMedium">
            No data available.
          </div>
        )}
      </div>
    </div>
  );
}
