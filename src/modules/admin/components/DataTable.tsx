import React from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  keyExtractor: (item: T) => string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  onAddNew: () => void;
  addButtonLabel?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  keyExtractor,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onAddNew,
  addButtonLabel = 'Add New',
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-[2px] border border-foreground bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-foreground"
            placeholder={searchPlaceholder}
          />
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center rounded-[2px] border border-foreground bg-primary px-4 py-2 text-sm font-bold font-mono tracking-wider uppercase text-primary-foreground transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {addButtonLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-[2px] border-2 border-foreground bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-foreground">
            <thead className="bg-muted">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono"
                  >
                    {col.header}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-muted-foreground font-mono uppercase tracking-wider">
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-muted-foreground font-mono uppercase tracking-wider">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={keyExtractor(item)} className="hover:bg-muted/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key as string} className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                        {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => onEdit(item)}
                          className="flex items-center justify-center p-1.5 rounded-[2px] border border-foreground bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="flex items-center justify-center p-1.5 rounded-[2px] border border-foreground bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
