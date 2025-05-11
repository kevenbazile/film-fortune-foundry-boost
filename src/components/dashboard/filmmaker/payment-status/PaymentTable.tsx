
import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PaymentStatus as PaymentStatusType } from "../revenue/types";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaymentTableProps {
  paymentData: PaymentStatusType[];
  totalCount: number;
  onPageChange: (page: number) => void;
  onSortChange: (column: string, direction: 'asc' | 'desc') => void;
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const PaymentTable: React.FC<PaymentTableProps> = ({ 
  paymentData, 
  totalCount, 
  onPageChange, 
  onSortChange,
  currentPage,
  pageSize,
  sortColumn,
  sortDirection
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
    onSortChange(column, newDirection);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const showingFrom = currentPage * pageSize + 1;
  const showingTo = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('paymentDate')}>
              <div className="flex items-center">
                Date {renderSortIcon('paymentDate')}
              </div>
            </TableHead>
            <TableHead>Film</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('platform')}>
              <div className="flex items-center">
                Platform {renderSortIcon('platform')}
              </div>
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('views')}>
              <div className="flex items-center">
                Views {renderSortIcon('views')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
              <div className="flex items-center">
                Amount {renderSortIcon('amount')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              <div className="flex items-center">
                Status {renderSortIcon('status')}
              </div>
            </TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                No payment data found.
              </TableCell>
            </TableRow>
          ) : (
            paymentData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{payment.filmTitle}</TableCell>
                <TableCell>{payment.platform}</TableCell>
                <TableCell>{payment.location}</TableCell>
                <TableCell>{payment.views?.toLocaleString() || '-'}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell className="font-mono text-sm">{payment.transactionId || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {totalCount > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {showingFrom} to {showingTo} of {totalCount} payments
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 0) onPageChange(currentPage - 1);
                  }} 
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i;
                
                // Adjust page numbers for cases when we're near the end
                if (totalPages > 5 && currentPage > 1) {
                  if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = Math.max(0, currentPage - 1) + i;
                  }
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 3 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(totalPages - 1);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
                  }}
                  className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
