
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
