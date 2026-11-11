import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LeaveService from "@/services/LeaveService";
import { formatDate } from "@/utils/formatDate";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function LeaveHistory({ leaves, onChanged }) {
  const [cancellingId, setCancellingId] = useState("");
  const [error, setError] = useState("");

  const handleCancel = async (id) => {
    setCancellingId(id);
    setError("");
    try {
      await LeaveService.cancelLeave(id);
      await onChanged();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCancellingId("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave history</CardTitle>
        <CardDescription>Your requests and their current status.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
        {leaves.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No leave requests yet. Submit your first request using the form.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applied</TableHead>
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
                  <TableCell className="whitespace-nowrap">{formatDate(leave.createdAt)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(leave.startDate)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(leave.endDate)}</TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell className="max-w-[220px] truncate" title={leave.reason}>
                    {leave.reason}
                  </TableCell>
                  <TableCell>
                    <LeaveStatusBadge status={leave.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {leave.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={cancellingId === leave.id}
                        onClick={() => handleCancel(leave.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
