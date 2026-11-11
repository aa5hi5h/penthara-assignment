import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LeaveService from "@/services/LeaveService";
import { countWeekdays, todayInputValue } from "@/utils/leaveDates";

const emptyForm = { startDate: "", endDate: "", reason: "" };

export default function LeaveForm({ onSubmitted }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = todayInputValue();
  const days = countWeekdays(form.startDate, form.endDate);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "startDate" && next.endDate && next.endDate < value) {
        next.endDate = value;
      }
      return next;
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await LeaveService.applyLeave(form);
      setForm(emptyForm);
      setSuccess("Leave request submitted");
      await onSubmitted();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for leave</CardTitle>
        <CardDescription>Weekends are not counted against your balance.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">From</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                min={today}
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">To</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                min={form.startDate || today}
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Briefly describe why you need leave"
              value={form.reason}
              onChange={handleChange}
              minLength={5}
              maxLength={500}
              required
            />
          </div>
          {days > 0 && (
            <p className="text-sm text-muted-foreground">
              This request uses {days} working {days === 1 ? "day" : "days"}.
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
