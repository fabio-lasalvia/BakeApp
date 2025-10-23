import express from "express";
import {
  index,
  show,
  create,
  update,
  remove,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { uploadCloudinary } from "../middlewares/common/uploadCloudinary.js";

const router = express.Router();

// Solo users autenticati
router.get("/", protect, index);
router.get("/:id", protect, show);

// Creazione, modifica ed eliminazione solo per admin e employee
router.post("/", protect, authorizeRoles("ADMIN", "EMPLOYEE"), uploadCloudinary.single("image"), create);
router.put("/:id", protect, authorizeRoles("ADMIN", "EMPLOYEE"), uploadCloudinary.single("image"), update);
router.delete("/:id", protect, authorizeRoles("ADMIN", "EMPLOYEE"), remove);

export default router;
