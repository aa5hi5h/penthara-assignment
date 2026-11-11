import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatCard({ title, value, hint }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function BalanceCards({ balance, leaves }) {
  const sumDays = (status) =>
    leaves.filter((leave) => leave.status === status).reduce((total, leave) => total + leave.days, 0);
  const pendingDays = sumDays("PENDING");
  const approvedDays = sumDays("APPROVED");
  const rejectedCount = leaves.filter((leave) => leave.status === "REJECTED").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Leave balance" value={balance} hint="days remaining" />
      <StatCard title="Pending" value={pendingDays} hint="days awaiting approval" />
      <StatCard title="Approved" value={approvedDays} hint="days taken or scheduled" />
      <StatCard title="Rejected" value={rejectedCount} hint={rejectedCount === 1 ? "request" : "requests"} />
    </div>
  );
}
