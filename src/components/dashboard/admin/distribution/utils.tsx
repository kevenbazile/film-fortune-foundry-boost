
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
    case "live":
    case "completed":
      return <Badge className="bg-green-500">{status}</Badge>;
    case "encoding":
      return <Badge className="bg-yellow-500">{status}</Badge>;
    case "metadata":
      return <Badge className="bg-blue-500">{status}</Badge>;
    case "submission":
      return <Badge className="bg-purple-500">{status}</Badge>;
    case "investigating":
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{status}</Badge>;
    case "in progress":
      return <Badge className="bg-blue-500">{status}</Badge>;
    case "resolved":
      return <Badge className="bg-green-500">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

