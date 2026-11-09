import { Router } from "express";
import {
  applyLeave,
  cancelLeave,
  listAllLeaves,
  listMyLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/mine", listMyLeaves);
router.post("/", applyLeave);
router.delete("/:id", cancelLeave);

router.get("/", requireAdmin, listAllLeaves);
router.patch("/:id/status", requireAdmin, updateLeaveStatus);

export default router;
