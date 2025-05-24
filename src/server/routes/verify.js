import express from "express";
import { verifyController } from "../controllers/index.js";

const router = express.Router();

router.post("/captcha", verifyController.verifyCaptcha);

export default router;
