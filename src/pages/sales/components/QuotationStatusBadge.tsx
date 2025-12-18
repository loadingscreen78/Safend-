
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge className="bg-black hover:bg-black/80">{status}</Badge>;
    case "Approved":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Rejected":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    case "Expired":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const getPricingTypeBadge = (type: string) => {
  switch (type) {
    case "Minimum Wages":
      return <Badge className="bg-black hover:bg-black/80">{type}</Badge>;
    case "Customized":
      return <Badge className="bg-red-500 hover:bg-red-600">{type}</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};
