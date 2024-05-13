import { Router } from "express";
import userRoutes from './authRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'

const router = Router()

router.use("/user",userRoutes)
router.use("/category",categoryRoutes)
router.use("/product",productRoutes)

export default router