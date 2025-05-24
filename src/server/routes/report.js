import express from "express";
import { reportController } from "../controllers/index.js";

const router = express.Router();

router.post("/seo-report", reportController.getSeoReport);
router.post("/performance-report", reportController.getPerformanceReport);
router.post("/page-summary-report", reportController.getPageSummaryReport);

export default router;
