import { Router } from "express";
import { isAdmin, requiredSign } from "../middlewares/authMiddleware.js";
import { AllCategory, createCategory, deleteCategory, singleCategory, updateCategory } from "../controllers/categoryController.js";

const router = Router()

router.post("/create-category",requiredSign,isAdmin,createCategory)

router.put("/update-category/:id",requiredSign,isAdmin,updateCategory)

router.get("/category",AllCategory)

router.get("/single-category/:slug",singleCategory)

router.delete("/delete-category/:id",requiredSign,isAdmin,deleteCategory)

export default router;