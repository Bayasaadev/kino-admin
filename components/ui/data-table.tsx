"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  totalCount: number
}

const PAGE_SIZE = 10

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange,
  isLoading,
  totalCount
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: { pageIndex, pageSize: PAGE_SIZE }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  })

  // For page buttons, display max 5
  const renderPageButtons = () => {
    let start = Math.max(0, pageIndex - 2)
    const end = Math.min(pageCount, start + 5)
    if (end - start < 5) start = Math.max(0, end - 5)
    return Array.from({ length: end - start }, (_, i) => {
      const p = start + i
      return (
        <PaginationItem key={p}>
          <PaginationLink
            isActive={p === pageIndex}
            onClick={e => {
              e.preventDefault()
              onPageChange(p)
            }}
            href="#"
          >
            {p + 1}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>Loading...</TableCell>
            </TableRow>
          ) : data.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-2 px-1">
        <div className="text-sm mb-2 md:mb-0 self-start w-full md:w-auto">
          Total: {data.length > 0 ? `${totalCount} items` : "No items"}
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pageIndex > 0 && onPageChange(pageIndex - 1)}
                  className={pageIndex === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {renderPageButtons()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => pageIndex + 1 < pageCount && onPageChange(pageIndex + 1)}
                  className={pageIndex + 1 >= pageCount ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}