import React from "react";
import { Table, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableWidgetProps {
  title: string;
  columns: string[];
  data: Array<Record<string, any>>;
  className?: string;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ 
  title, 
  columns, 
  data, 
  className 
}) => {
  return (
    <div className={cn("rounded-lg border bg-background overflow-hidden", className)}>
      <div className="px-4 py-2 bg-muted/50 flex items-center gap-2 border-b">
        <Table className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-sm font-medium">{title}</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <FileCode className="h-3 w-3" />
          <span>{data.length} row{data.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="p-4">
        {data.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No data to display
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-muted">
                  {columns.map((column, idx) => (
                    <th 
                      key={idx} 
                      className="text-left py-2 px-3 font-medium text-muted-foreground bg-muted/30 first:rounded-l-md last:rounded-r-md"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className={cn(
                      "border-b border-muted/50 hover:bg-muted/60 transition-colors cursor-pointer",
                      rowIdx === data.length - 1 && "border-b-0"
                    )}
                  >
                    {columns.map((column, colIdx) => (
                      <td 
                        key={colIdx} 
                        className="py-2 px-3 align-top"
                      >
                        <div className="max-w-xs overflow-hidden">
                          {row[column] !== undefined && row[column] !== null ? (
                            typeof row[column] === 'string' ? (
                              <span className="whitespace-pre-wrap break-words">
                                {row[column]}
                              </span>
                            ) : (
                              <code className="text-xs font-mono bg-muted/50 px-1 py-0.5 rounded">
                                {JSON.stringify(row[column])}
                              </code>
                            )
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};