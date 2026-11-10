import { request } from "./apiClient";

const LeaveService = {
  async getMyLeaves() {
    const data = await request("/leaves/mine");
    return data.leaves;
  },

  async applyLeave(payload) {
    const data = await request("/leaves", { method: "POST", body: payload });
    return data.leave;
  },

  async cancelLeave(id) {
    await request(`/leaves/${id}`, { method: "DELETE" });
  },

  async getAllLeaves() {
    const data = await request("/leaves");
    return data.leaves;
  },

  async updateLeaveStatus(id, status) {
    const data = await request(`/leaves/${id}/status`, { method: "PATCH", body: { status } });
    return data.leave;
  },
};

export default LeaveService;
