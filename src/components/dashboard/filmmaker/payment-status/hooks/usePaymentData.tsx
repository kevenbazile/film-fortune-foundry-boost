
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentData, fetchPaymentSummary } from "../services/paymentDataService";
import { useAuth } from "@/context/AuthContext";

export function usePaymentData(
  page: number = 0,
  pageSize: number = 10,
  sortColumn: string = 'paymentDate',
  sortDirection: 'asc' | 'desc' = 'desc'
) {
  const { user } = useAuth();
  const userId = user?.id || null;

  const paymentsQuery = useQuery({
    queryKey: ['payments', userId, page, pageSize, sortColumn, sortDirection],
    queryFn: () => fetchPaymentData(userId, page, pageSize, sortColumn, sortDirection),
    enabled: !!userId,
  });

  const summaryQuery = useQuery({
    queryKey: ['paymentSummary', userId],
    queryFn: () => fetchPaymentSummary(userId),
    enabled: !!userId,
  });

  return {
    paymentData: paymentsQuery.data?.data || [],
    totalCount: paymentsQuery.data?.count || 0,
    summary: summaryQuery.data || {
      totalPaid: 0,
      totalPending: 0,
      totalFailed: 0,
      nextPaymentDate: null,
      totalProcessing: 0
    },
    isLoading: paymentsQuery.isLoading || summaryQuery.isLoading,
    isError: paymentsQuery.isError || summaryQuery.isError,
    error: paymentsQuery.error || summaryQuery.error,
    refetch: () => {
      paymentsQuery.refetch();
      summaryQuery.refetch();
    }
  };
}
