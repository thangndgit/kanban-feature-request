import express from "express";
import { visitorController } from "../controllers/index.js";

const router = express.Router();

// router.get("/:id", visitorController.getById);
// router.put("/:id", visitorController.updateById);
router.get("/", visitorController.getAll);
router.post("/", visitorController.create);
// router.delete("/:id", visitorController.deleteById);

export default router;
