
export interface Earning {
  id: string;
  date: string;
  platform: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  payerInfo: {
    name: string;
    type: 'platform' | 'direct';
  };
  notes?: string;
  location?: string;
}

export interface RevenueData {
  totalRevenue: number;
  growthRate: number;
  daysSinceRelease: number;
  platformRevenue: { name: string; revenue: number }[];
  growthTimeline: { month: string; revenue: number }[];
}

export interface UserFilmData {
  userId: string | null;
  filmId: string | null;
  userTier: 'basic' | 'premium' | 'elite' | null;
}

export interface PaymentStatus {
  id: string;
  filmTitle: string;
  platform: string;
  location: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'paid' | 'processing';
  paymentMethod?: string;
  transactionId?: string;
  views?: number;
  notes?: string;
}
