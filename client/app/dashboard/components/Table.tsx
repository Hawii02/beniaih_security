// components/ui/Table.tsx
import React from "react";

type Column<T> = {
  header: string;
  key: keyof T | string;
  className?: string;
  hideOnMobile?: boolean;
  render?: (row: T, idx: number) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  rowKey?: (row: T, idx: number) => string | number;
};

export function Table<T>({
  columns,
  data,
  emptyText = "No results.",
  rowKey,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key.toString()}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.hideOnMobile ? "hidden sm:table-cell" : ""} ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length ? (
            data.map((row, idx) => (
              <tr key={rowKey ? rowKey(row, idx) : idx}>
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key.toString()}
                    className={`px-6 py-4 whitespace-nowrap ${col.hideOnMobile ? "hidden sm:table-cell" : ""} ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row, idx)
                      : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}