import React from 'react';
import { Edit2, Trash2, Search, Plus } from 'lucide-react';

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
            className="block w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder={searchPlaceholder}
          />
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          <Plus className="h-4 w-4" />
          {addButtonLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {col.header}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-card">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={keyExtractor(item)} className="hover:bg-muted/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key as string} className="whitespace-nowrap px-6 py-4 text-sm text-card-foreground font-medium">
                        {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="flex items-center justify-center p-2 rounded bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="flex items-center justify-center p-2 rounded bg-destructive/10 hover:bg-destructive/20 text-destructive border border-border transition-colors"
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
