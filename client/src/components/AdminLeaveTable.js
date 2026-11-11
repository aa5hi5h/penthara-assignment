import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LeaveService from "@/services/LeaveService";
import { formatDate } from "@/utils/formatDate";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function AdminLeaveTable({ leaves, onUpdated }) {
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const handleReview = async (id, status) => {
    setBusyId(id);
    setError("");
    try {
      const updated = await LeaveService.updateLeaveStatus(id, status);
      onUpdated(updated);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  if (leaves.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No leave requests have been submitted.</p>;
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>
                <div className="font-medium">{leave.user.name}</div>
                <div className="text-xs text-muted-foreground">{leave.user.email}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(leave.startDate)}</TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(leave.endDate)}</TableCell>
              <TableCell>{leave.days}</TableCell>
              <TableCell className="max-w-[220px] truncate" title={leave.reason}>
                {leave.reason}
              </TableCell>
              <TableCell>
                <LeaveStatusBadge status={leave.status} />
              </TableCell>
              <TableCell>
                {leave.status === "PENDING" && (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" disabled={busyId === leave.id} onClick={() => handleReview(leave.id, "APPROVED")}>
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === leave.id}
                      onClick={() => handleReview(leave.id, "REJECTED")}
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
