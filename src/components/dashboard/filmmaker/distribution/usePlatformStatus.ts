
import { Distribution, PlatformStatus } from "./types";

export function usePlatformStatus(distributions: Distribution[]) {
  // Get platform status information for display
  const getPlatformStatuses = (): PlatformStatus[] => {
    if (distributions.length === 0) {
      return [];
    }
    
    return distributions.map(dist => ({
      platform: dist.platform,
      status: dist.status === 'live' || dist.status === 'completed' ? 'live' : 
              dist.status === 'submission' ? 'submitted' : 
              dist.status === 'metadata' ? 'processing' : 'queued',
      expectedLiveDate: dist.expectedLiveDate || 'TBD',
      notes: dist.notes || 'Processing'
    }));
  };

  return {
    getPlatformStatuses
  };
}
