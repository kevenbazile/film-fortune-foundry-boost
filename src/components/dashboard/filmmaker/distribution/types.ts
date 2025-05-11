
export type DistributionStatus = 'encoding' | 'metadata' | 'submission' | 'live' | 'completed';

export type Distribution = {
  id: string;
  filmId: string;
  filmTitle: string;
  platform: string;
  platformUrl: string | null;
  status: DistributionStatus;
  submittedAt: string;
  completedAt: string | null;
  expectedLiveDate?: string;
  notes?: string;
};

export type DistributionStage = {
  stage: string;
  status: 'completed' | 'in-progress' | 'pending';
  completedOn: string | null;
  notes: string;
};

export type PlatformStatus = {
  platform: string;
  status: 'queued' | 'submitted' | 'processing' | 'live';
  expectedLiveDate: string;
  notes: string;
};
