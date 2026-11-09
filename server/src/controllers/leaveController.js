import { prisma } from "../lib/prisma.js";
import { httpError } from "../utils/httpError.js";
import { countWeekdays, isValidObjectId, parseDateInput, startOfTodayUtc } from "../utils/leaveDates.js";

export async function listMyLeaves(req, res) {
  const leaves = await prisma.leave.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ leaves });
}

export async function applyLeave(req, res) {
  const start = parseDateInput(req.body?.startDate);
  const end = parseDateInput(req.body?.endDate);
  const reason = String(req.body?.reason ?? "").trim();

  if (!start || !end) {
    throw httpError(400, "A valid start date and end date are required");
  }
  if (end < start) {
    throw httpError(400, "End date cannot be before start date");
  }
  if (start < startOfTodayUtc()) {
    throw httpError(400, "Start date cannot be in the past");
  }
  if (reason.length < 5 || reason.length > 500) {
    throw httpError(400, "Reason must be between 5 and 500 characters");
  }

  const days = countWeekdays(start, end);
  if (days === 0) {
    throw httpError(400, "The selected dates only include weekends");
  }

  const overlapping = await prisma.leave.findFirst({
    where: {
      userId: req.user.id,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lte: end },
      endDate: { gte: start },
    },
  });
  if (overlapping) {
    throw httpError(409, "These dates overlap with an existing leave request");
  }

  const pending = await prisma.leave.aggregate({
    where: { userId: req.user.id, status: "PENDING" },
    _sum: { days: true },
  });
  const available = req.user.leaveBalance - (pending._sum.days ?? 0);
  if (days > available) {
    throw httpError(400, `You only have ${Math.max(available, 0)} day(s) available`);
  }

  const leave = await prisma.leave.create({
    data: { userId: req.user.id, startDate: start, endDate: end, days, reason },
  });
  res.status(201).json({ leave });
}

export async function cancelLeave(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw httpError(404, "Leave request not found");
  }

  const leave = await prisma.leave.findFirst({ where: { id, userId: req.user.id } });
  if (!leave) {
    throw httpError(404, "Leave request not found");
  }
  if (leave.status !== "PENDING") {
    throw httpError(400, "Only pending requests can be cancelled");
  }

  await prisma.leave.delete({ where: { id } });
  res.status(204).end();
}

export async function listAllLeaves(req, res) {
  const leaves = await prisma.leave.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
  res.json({ leaves });
}

export async function updateLeaveStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!isValidObjectId(id)) {
    throw httpError(404, "Leave request not found");
  }
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw httpError(400, "Status must be APPROVED or REJECTED");
  }

  const leave = await prisma.$transaction(async (tx) => {
    const existing = await tx.leave.findUnique({ where: { id }, include: { user: true } });
    if (!existing) {
      throw httpError(404, "Leave request not found");
    }
    if (existing.status !== "PENDING") {
      throw httpError(400, "Only pending requests can be reviewed");
    }

    if (status === "APPROVED") {
      if (existing.user.leaveBalance < existing.days) {
        throw httpError(400, "Employee does not have enough leave balance");
      }
      await tx.user.update({
        where: { id: existing.userId },
        data: { leaveBalance: { decrement: existing.days } },
      });
    }

    return tx.leave.update({
      where: { id },
      data: { status },
      include: { user: { select: { name: true, email: true } } },
    });
  });

  res.json({ leave });
}
