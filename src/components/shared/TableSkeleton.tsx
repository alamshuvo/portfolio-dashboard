"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface TableSkeletonProps {
  rows?: number;
  cols: number;
  cellWidths?: string[];
  className?: string;
}

export const TableSkeleton = ({
  rows = 7,
  cols,
  cellWidths = [],
  className = "",
}: TableSkeletonProps) => {
  const defaultWidths = [
    "w-[120px]",
    "w-[60px]",
    "w-[80px]",
    "w-[100px]",
    "w-[80px]",
    "w-[180px]",
  ];

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className={`animate-pulse ${className}`} // Animate entire row
        >
          {Array.from({ length: cols }).map((_, colIndex) => {
            const widthClass =
              cellWidths[colIndex] ||
              defaultWidths[colIndex] ||
              "w-full";

            return (
              <TableCell key={colIndex}>
                <Skeleton className={`h-4 ${widthClass}`} />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};
