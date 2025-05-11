import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus } from "../../revenue/types";
import { format } from "date-fns";

export async function fetchPaymentData(
  userId: string | null, 
  page: number = 0, 
  pageSize: number = 10,
  sortColumn: string = 'paymentDate',
  sortDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: PaymentStatus[]; count: number }> {
  if (!userId) return { data: [], count: 0 };
  
  try {
    // Map frontend column names to database column names
    const columnMap: Record<string, string> = {
      'paymentDate': 'payment_date',
      'amount': 'amount',
      'status': 'status',
      'platform': 'platform',
      'views': 'views'
    };
    
    const dbColumn = columnMap[sortColumn] || 'payment_date';
    
    // First get total count
    const { count, error: countError } = await supabase
      .from('platform_earnings')
      .select('*', { count: 'exact', head: true })
      .eq('films.user_id', userId);
    
    if (countError) {
      console.error("Error fetching payment count:", countError);
      throw countError;
    }
    
    // Then get paginated data
    const { data: earningsData, error: earningsError } = await supabase
      .from('platform_earnings')
      .select('id, film_id, platform, amount, payment_date, status, payment_method, transaction_id, views, films!inner(title)')
      .eq('films.user_id', userId)
      .order(dbColumn, { ascending: sortDirection === 'asc' })
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (earningsError) {
      console.error("Error fetching payment data:", earningsError);
      throw earningsError;
    }
    
    // Transform the data to match our PaymentStatus type
    const transformedData = earningsData.map(earning => ({
      id: earning.id,
      filmTitle: earning.films?.title || 'Unknown Film',
      platform: earning.platform,
      location: earning.location || 'Global', // Default location if not provided
      amount: earning.amount,
      paymentDate: earning.payment_date,
      status: earning.status as 'pending' | 'paid' | 'processing',
      paymentMethod: earning.payment_method || 'Direct Deposit',
      transactionId: earning.transaction_id || '',
      views: earning.views || 0
    }));
    
    return {
      data: transformedData,
      count: count || 0
    };
    
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return { data: [], count: 0 }; // Return empty array in case of error
  }
}

export async function fetchPaymentSummary(userId: string | null) {
  if (!userId) return {
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    nextPaymentDate: null
  };
  
  try {
    // Get payments with status 'paid'
    const { data: paidData, error: paidError } = await supabase
      .from('platform_earnings')
      .select('amount, films!inner(user_id)')
      .eq('films.user_id', userId)
      .eq('status', 'paid');
    
    if (paidError) throw paidError;
    
    // Get payments with status 'pending'
    const { data: pendingData, error: pendingError } = await supabase
      .from('platform_earnings')
      .select('amount, films!inner(user_id)')
      .eq('films.user_id', userId)
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // Get next payment date (future payments)
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const { data: nextPayment, error: nextPaymentError } = await supabase
      .from('platform_earnings')
      .select('payment_date, films!inner(user_id)')
      .eq('films.user_id', userId)
      .gt('payment_date', today)
      .order('payment_date', { ascending: true })
      .limit(1);
    
    if (nextPaymentError) throw nextPaymentError;
    
    const totalPaid = paidData.reduce((sum, item) => sum + item.amount, 0);
    const totalPending = pendingData.reduce((sum, item) => sum + item.amount, 0);
    
    // Get processing payments
    const { data: processingData, error: processingError } = await supabase
      .from('platform_earnings')
      .select('amount, films!inner(user_id)')
      .eq('films.user_id', userId)
      .eq('status', 'processing');
    
    if (processingError) throw processingError;
    
    const totalProcessing = processingData.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      totalPaid,
      totalPending,
      totalFailed: 0, // We don't have a 'failed' status in our current setup
      nextPaymentDate: nextPayment && nextPayment.length > 0 ? new Date(nextPayment[0].payment_date) : null,
      totalProcessing
    };
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    return {
      totalPaid: 0,
      totalPending: 0,
      totalFailed: 0,
      nextPaymentDate: null,
      totalProcessing: 0
    };
  }
}

export function exportPaymentsToCSV(payments: PaymentStatus[]) {
  const csvContent = [
    ['Invoice', 'Date', 'Film', 'Platform', 'Location', 'Views', 'Amount', 'Status', 'Payment Method', 'Reference'],
    ...payments.map(p => [
      p.id,
      format(new Date(p.paymentDate), 'yyyy-MM-dd'),
      p.filmTitle,
      p.platform,
      p.location,
      p.views?.toString() || '0',
      p.amount.toString(),
      p.status,
      p.paymentMethod || '-',
      p.transactionId || '-'
    ])
  ];

  const csvString = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payment-status-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
}
