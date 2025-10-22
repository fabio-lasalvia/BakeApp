import express from "express";
import {
    index,
    show,
    create,
    update,
    remove,
    updateRole,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/", index);
router.get("/:id", show);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id/role", updateRole);

export default router;
