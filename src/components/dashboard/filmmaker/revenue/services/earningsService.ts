
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Earning } from "../types";

export async function fetchEarningsData(userId: string): Promise<Earning[]> {
  if (!userId) return [];
  
  try {
    // In a real app, we would fetch from revenue_shares table
    // For now, we'll use sample data since earnings aren't part of our tables yet
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
  } catch (error) {
    console.error("Error fetching earnings data:", error);
    throw error;
  }
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
