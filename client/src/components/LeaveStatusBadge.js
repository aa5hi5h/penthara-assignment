import { Badge } from "@/components/ui/badge";

const statusConfig = {
  PENDING: { label: "Pending", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
};

export default function LeaveStatusBadge({ status }) {
  const config = statusConfig[status] ?? { label: status, variant: "secondary" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
