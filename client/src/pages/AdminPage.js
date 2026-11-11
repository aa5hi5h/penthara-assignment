import { useEffect, useMemo, useState } from "react";
import AdminLeaveTable from "@/components/AdminLeaveTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LeaveService from "@/services/LeaveService";

export default function AdminPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    LeaveService.getAllLeaves()
      .then(setLeaves)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (updated) => {
    setLeaves((current) => current.map((leave) => (leave.id === updated.id ? updated : leave)));
  };

  const sorted = useMemo(() => {
    const rank = (leave) => (leave.status === "PENDING" ? 0 : 1);
    return [...leaves].sort((a, b) => rank(a) - rank(b));
  }, [leaves]);

  const pendingCount = leaves.filter((leave) => leave.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leave requests</h1>
        <p className="text-sm text-muted-foreground">
          {pendingCount === 0 ? "Nothing is waiting for review." : `${pendingCount} waiting for review.`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All requests</CardTitle>
          <CardDescription>Approving a request deducts the days from the employee balance.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          ) : (
            <AdminLeaveTable leaves={sorted} onUpdated={handleUpdated} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
