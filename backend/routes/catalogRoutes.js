import express from "express";
import {
    index,
    show,
    create,
    update,
    remove,
} from "../controllers/catalogController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/", index);
router.get("/:id", show);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
