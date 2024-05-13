import { Router } from "express";
import { forgotPassword, getAllOrders, getOrders, login, orderStatus, register, testController, updateProfile } from "../controllers/authController.js";
import { isAdmin, requiredSign } from "../middlewares/authMiddleware.js";

const router = Router()

router.post("/register",register)
router.post("/login",login)
router.post('/forgot-pass',forgotPassword)
router.get("/test",requiredSign,testController)
router.get("/user-auth",requiredSign,(req,res)=>{
    return res.status(200).json({ok:true});
})

router.get("/admin-auth",requiredSign,isAdmin,(req,res)=>{
    return res.status(200).json({ok:true});
})

router.put("/profile",requiredSign,updateProfile)

router.get("/orders",requiredSign,getOrders)

router.get("/all-orders",requiredSign,isAdmin,getAllOrders)

router.put("/order-status/:ordersId",requiredSign,isAdmin,orderStatus)

export default router