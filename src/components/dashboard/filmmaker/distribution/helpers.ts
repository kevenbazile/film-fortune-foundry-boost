
import { Distribution, DistributionStatus } from "./types";

// Helper function to estimate a live date based on status and submission date
export const getExpectedLiveDate = (status: string, submittedAt: string): string => {
  const submissionDate = new Date(submittedAt);
  
  // Different statuses have different lead times
  const daysToAdd = 
    status === 'encoding' ? 7 : 
    status === 'metadata' ? 5 : 
    status === 'submission' ? 3 :
    status === 'live' ? 0 : 1;
    
  submissionDate.setDate(submissionDate.getDate() + daysToAdd);
  return submissionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to generate contextual notes based on status
export const getDistributionNotes = (status: string): string => {
  switch(status) {
    case 'encoding':
      return 'Your film is being encoded to meet platform requirements.';
    case 'metadata':
      return 'Preparing metadata including descriptions, cast, and technical specs.';
    case 'submission':
      return 'Your film is being submitted to the platform.';
    case 'live':
      return 'Your film is now live and available to viewers.';
    case 'completed':
      return 'Distribution is complete and your film is available to viewers.';
    default:
      return 'Processing your film for distribution.';
  }
};
