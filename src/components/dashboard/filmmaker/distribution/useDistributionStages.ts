
import { Distribution, DistributionStage } from "./types";

export function useDistributionStages(distributions: Distribution[]) {
  // Transform distribution data to progress stages for the UI
  const getDistributionStages = (): DistributionStage[] => {
    const latestDistribution = distributions[0];
    
    // If no distribution data, return default stages
    if (!latestDistribution) {
      return [
        { stage: "Submission Review", status: "pending", completedOn: null, notes: "Your film will be reviewed for distribution." },
        { stage: "Encoding & Optimization", status: "pending", completedOn: null, notes: "Your film will be encoded to meet platform requirements." },
        { stage: "Metadata Preparation", status: "pending", completedOn: null, notes: "All metadata including descriptions, cast, and technical specs will be prepared." },
        { stage: "Platform Submission", status: "pending", completedOn: null, notes: "Your film will be submitted to selected platforms." },
        { stage: "QA & Validation", status: "pending", completedOn: null, notes: "Quality assurance checks will ensure your film displays correctly on all platforms." },
        { stage: "Live Distribution", status: "pending", completedOn: null, notes: "Your film will be publicly available on all selected platforms." }
      ];
    }
    
    const currentStatus = latestDistribution.status;
    const submittedAt = new Date(latestDistribution.submittedAt);
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    
    // Map status to stages
    return [
      { 
        stage: "Submission Review", 
        status: "completed", 
        completedOn: submittedAt.toLocaleDateString('en-US', dateOptions),
        notes: "Your film has been reviewed and approved for distribution."
      },
      { 
        stage: "Encoding & Optimization", 
        status: currentStatus === 'encoding' ? 'in-progress' : 
               (currentStatus === 'metadata' || currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'metadata' || currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 2*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Your film is being encoded to meet platform requirements."
      },
      { 
        stage: "Metadata Preparation", 
        status: currentStatus === 'metadata' ? 'in-progress' : 
               (currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'submission' || currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 4*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "All metadata including descriptions, cast, and technical specs are being prepared."
      },
      { 
        stage: "Platform Submission", 
        status: currentStatus === 'submission' ? 'in-progress' : 
               (currentStatus === 'live' || currentStatus === 'completed') ? 'completed' : 'pending',
        completedOn: (currentStatus === 'live' || currentStatus === 'completed') ? 
                    new Date(submittedAt.getTime() + 6*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Your film is being submitted to selected platforms."
      },
      { 
        stage: "QA & Validation", 
        status: currentStatus === 'live' && !latestDistribution.completedAt ? 'in-progress' : 
               (currentStatus === 'completed' || (currentStatus === 'live' && latestDistribution.completedAt)) ? 'completed' : 'pending',
        completedOn: (currentStatus === 'completed' || (currentStatus === 'live' && latestDistribution.completedAt)) ? 
                    new Date(submittedAt.getTime() + 8*24*60*60*1000).toLocaleDateString('en-US', dateOptions) : null,
        notes: "Quality assurance checks ensure your film displays correctly on all platforms."
      },
      { 
        stage: "Live Distribution", 
        status: currentStatus === 'completed' ? 'completed' : 'pending',
        completedOn: currentStatus === 'completed' ? latestDistribution.completedAt : null,
        notes: "Your film is publicly available on all selected platforms."
      }
    ];
  };

  // Calculate progress percentage based on completed stages
  const calculateProgress = (): number => {
    const stages = getDistributionStages();
    const completedStages = stages.filter(stage => stage.status === "completed").length;
    return Math.floor((completedStages / stages.length) * 100);
  };

  return {
    getDistributionStages,
    calculateProgress
  };
}
