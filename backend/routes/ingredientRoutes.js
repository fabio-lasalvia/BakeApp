import express from "express";
import {
  index,
  show,
  create,
  update,
  remove,
} from "../controllers/ingredientController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { uploadCloudinary } from "../middlewares/common/uploadCloudinary.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN", "EMPLOYEE"));

router.get("/", index);
router.get("/:id", show);
router.post("/", uploadCloudinary.single("image"), create);
router.put("/:id", uploadCloudinary.single("image"), update);
router.delete("/:id", remove);

export default router;
