
import { Badge } from "@/components/ui/badge";

export const getDistributionStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "live":
      return <Badge className="bg-green-500">Live</Badge>;
    case "encoding":
      return <Badge className="bg-yellow-500">Encoding</Badge>;
    case "metadata":
      return <Badge className="bg-blue-500">Metadata</Badge>;
    case "submission":
      return <Badge className="bg-purple-500">Submission</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const formatDistributionDate = (date: string | null): string => {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
