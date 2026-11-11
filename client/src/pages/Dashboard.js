import { useCallback, useEffect, useState } from "react";
import BalanceCards from "@/components/BalanceCards";
import LeaveForm from "@/components/LeaveForm";
import LeaveHistory from "@/components/LeaveHistory";
import { useAuth } from "@/context/AuthContext";
import LeaveService from "@/services/LeaveService";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = useCallback(async () => {
    try {
      setLeaves(await LeaveService.getMyLeaves());
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadLeaves(), refreshUser()]).finally(() => setLoading(false));
  }, [loadLeaves, refreshUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hello, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here is where your leave stands.</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <BalanceCards balance={user.leaveBalance} leaves={leaves} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LeaveForm onSubmitted={loadLeaves} />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading your leave history...</p>
          ) : (
            <LeaveHistory leaves={leaves} onChanged={loadLeaves} />
          )}
        </div>
      </div>
    </div>
  );
}
