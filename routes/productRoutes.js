import { Router } from "express";
import { AllProduct, brainTreePayment, braintreeToken, createProduct, deleteProduct, getSingleProduct, productCategory, productCount, productFilter, productList, productPhoto, relatedProduct, searchProduct, updateProduct } from "../controllers/productController.js";
import { isAdmin, requiredSign } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = Router();

router.post("/create-product",requiredSign,isAdmin,formidable(),createProduct)

router.put("/update-product/:pid",requiredSign,isAdmin,formidable(),updateProduct)

router.get("/get-product",AllProduct)

router.get("/get-product/:slug",getSingleProduct)

router.get("/product-photo/:pid",productPhoto)

router.delete("/delete-product/:pid",deleteProduct)

router.post("/product-filters",productFilter)

router.get("/product-count",productCount)

router.get("/product-list/:page",productList)

router.get("/search/:keyword",searchProduct)

router.get("/related-product/:pid/:cid",relatedProduct)

router.get("/product-category/:slug",productCategory)

router.get("/braintree/token",braintreeToken)

router.post("/braintree/payment",requiredSign,brainTreePayment)



export default router