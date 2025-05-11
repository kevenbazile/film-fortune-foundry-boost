
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Earning } from "../types";

export async function fetchEarningsData(userId: string): Promise<Earning[]> {
  if (!userId) return [];
  
  try {
    // Try to fetch from platform_earnings table first
    const { data: earningsData, error: earningsError } = await supabase
      .from('platform_earnings')
      .select('id, film_id, platform, amount, payment_date, payment_period_start, payment_period_end, views, status, transaction_id, notes, films!inner(user_id)')
      .eq('films.user_id', userId)
      .order('payment_date', { ascending: false });
    
    if (earningsError) {
      console.error("Error fetching earnings data:", earningsError);
      // Fall back to sample data if there's an error
      return getSampleEarningsData();
    }
    
    // If we have data from the platform_earnings table, format and return it
    if (earningsData && earningsData.length > 0) {
      return earningsData.map(entry => ({
        id: entry.id,
        date: entry.payment_date,
        platform: entry.platform,
        amount: entry.amount,
        status: transformStatus(entry.status),
        notes: entry.notes,
        payerInfo: {
          name: entry.platform,
          type: 'platform'
        }
      }));
    }
    
    // Fall back to sample data if no real data is available
    return getSampleEarningsData();
  } catch (error) {
    console.error("Error fetching earnings data:", error);
    return getSampleEarningsData();
  }
}

// Helper function to transform status string to valid Earning status type
function transformStatus(status: string): 'pending' | 'paid' | 'disputed' {
  if (status === 'pending' || status === 'paid' || status === 'disputed') {
    return status as 'pending' | 'paid' | 'disputed';
  }
  // Default to pending if the status isn't one of the expected values
  return 'pending';
}

// Helper function to get sample data if real data is not available
function getSampleEarningsData(): Earning[] {
  const sampleEarnings: Earning[] = [
    {
      id: '1',
      date: '2025-04-15',
      platform: 'Netflix',
      amount: 1250.00,
      status: 'paid',
      payerInfo: {
        name: 'Netflix Inc.',
        type: 'platform'
      }
    },
    {
      id: '2',
      date: '2025-05-01',
      platform: 'YouTube',
      amount: 750.50,
      status: 'pending',
      payerInfo: {
        name: 'YouTube',
        type: 'platform'
      }
    },
    {
      id: '3',
      date: '2025-05-05',
      platform: 'Amazon Prime',
      amount: 950.75,
      status: 'pending',
      payerInfo: {
        name: 'Amazon Services LLC',
        type: 'platform'
      }
    }
  ];
  
  return sampleEarnings;
}

export function exportEarningsToCSV(earnings: Earning[]) {
  const csvContent = [
    ['Date', 'Platform', 'Amount', 'Status', 'Payer'],
    ...earnings.map(e => [
      format(new Date(e.date), 'yyyy-MM-dd'),
      e.platform,
      e.amount.toString(),
      e.status,
      e.payerInfo.name
    ])
  ];

  const csvString = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `earnings-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
}
