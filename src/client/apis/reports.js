import { makeApiFetch } from "../utils/api";

const reportsApi = {
  getSeoReport: (url) => makeApiFetch("reports/seo-report", { method: "post", params: { url } }),

  getPageSummaryReport: (url) => makeApiFetch("reports/page-summary-report", { method: "post", params: { url } }),

  getPerformanceReport: (url, strategy = "mobile") =>
    makeApiFetch("reports/performance-report", { method: "post", params: { url, strategy } }),
};

export default reportsApi;
