import { getRequest } from "../Helpers/index.js";

// ── Admin only ────────────────────────────────────────────────────────────────

export const getAdminStatsApi = () =>
  getRequest("/admin/stats");
