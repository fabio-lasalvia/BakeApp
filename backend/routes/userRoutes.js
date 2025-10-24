import express from "express";
import {
  index,
  show,
  create,
  update,
  remove,
  updateRole,
  getMe,
  updateMe,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { uploadCloudinary } from "../middlewares/common/uploadCloudinary.js"

const router = express.Router();


///// Rotte accessibili a tutti gli utenti autenticati /////
router.use(protect);

// Ogni utente può visualizzare e aggiornare il proprio profilo
router.get("/me", protect, getMe);
router.put("/me", protect, uploadCloudinary.single("avatar"), updateMe);


///// Rotte riservate solo agli admin /////
router.use(authorizeRoles("ADMIN"));

router.get("/", index);
router.get("/:id", show);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id/role", updateRole);

export default router;
