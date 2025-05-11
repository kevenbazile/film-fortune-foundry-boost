
import { useDistributionFetch } from "./useDistributionFetch";
import { useDistributionStages } from "./useDistributionStages";
import { usePlatformStatus } from "./usePlatformStatus";
import { DistributionStage, PlatformStatus } from "./types";

export function useDistributionData() {
  const { 
    distributions, 
    loading, 
    userTier, 
    filmId, 
    userId 
  } = useDistributionFetch();
  
  const { getDistributionStages, calculateProgress } = useDistributionStages(distributions);
  const { getPlatformStatuses } = usePlatformStatus(distributions);

  // Get the final distribution stages
  const distributionStages: DistributionStage[] = getDistributionStages();
  
  // Get the platform statuses
  const platformStatuses: PlatformStatus[] = getPlatformStatuses();
  
  // Calculate the overall progress
  const progress: number = calculateProgress();

  return {
    distributions,
    distributionStages,
    platformStatuses,
    progress,
    loading,
    userTier,
    filmId,
    userId
  };
}
