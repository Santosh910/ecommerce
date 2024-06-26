import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'
import categoryModel from "../models/categoryModel.js";

import braintree from "braintree";
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHAND_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const {
            photo
        } = req.files;

        switch (true) {
            case !name:
                return res.status(500).json({
                    error: "Name is Required"
                });
            case !description:
                return res.status(500).json({
                    error: "Description is Required"
                })
            case !price:
                return res.status(500).json({
                    error: "Price is Required"
                });
            case !category:
                return res.status(500).json({
                    error: "Category is Required"
                });
            case !quantity:
                return res.status(500).json({
                    error: "Quantity is Required"
                });
            case photo && photo.size > 1000000:
                return res.status(500).json({
                    error: "photo is required and should be less then 1mb"
                })
        }

        const products = new productModel({
            ...req.fields,
            slug: slugify(name)
        })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        return res.status(201).json({
            success: true,
            message: "product created successfully",
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
}

export const AllProduct = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({
            created: -1
        })

        return res.status(200).json({
            success: true,
            countTotal: products.length,
            message: "Allproducts",
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in getting product",
        });
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const products = await productModel.findOne({
            slug: req.params.slug
        }).populate("category").select("-photo")

        return res.status(200).json({
            success: true,
            message: "single product fetched",
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in getting product",
        });
    }
}

export const productPhoto = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");

        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in getting photo",
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")

        return res.status(200).json({
            success: true,

            message: "product Deleted successfully",

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in deleting product",
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const {
            photo
        } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({
                    error: "Name is Required"
                });
            case !description:
                return res.status(500).send({
                    error: "Description is Required"
                });
            case !price:
                return res.status(500).send({
                    error: "Price is Required"
                });
            case !category:
                return res.status(500).send({
                    error: "Category is Required"
                });
            case !quantity:
                return res.status(500).send({
                    error: "Quantity is Required"
                });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({
                        error: "photo is Required and should be less then 1mb"
                    });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields,
            slug: slugify(name)
        }, {
            new: true
        })

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        return res.status(201).json({
            success: true,
            message: "product updated successfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
}

export const productFilter = async (res, req) => {
    try {
        const {
            checked,
            radio
        } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = {
            $gte: radio[0],
            $lte: radio[1]
        };
        const products = await productModel.find(args);

        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(error);
        // res.status(500).json({
        //     success: false,
        //     message: "Error while filtering products",
        //     error
        // })
    }
}

export const productCount = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        return res.status(200).json({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Error in product count",
            error,
            success: false,
        });
    }
}

export const productList = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({
            createdAt: -1
        });
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
}


export const relatedProduct = async (req, res) => {
    try {
        const {
            pid,
            cid
        } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: {
                $ne: pid
            }
        }).select("-photo").limit(3).populate("category");
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "error while getting related product",
            error
        })
    }
}

export const searchProduct = async (req, res) => {
    try {
        const {
            keyword
        } = req.params;
        const resutls = await productModel.find({
            $or: [{
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        }).select("-photo");
        res.json(resutls);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
}

export const productCategory = async (req, res) => {
    try {
        const category = await categoryModel.findOne({
            slug: req.params.slug
        });
        const products = await productModel.find({
            category
        }).populate("category");
        return res.status(200).json({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
}

export const braintreeToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const brainTreePayment = async (req, res) => {
    try {
        const {
            nonce,
            cart
        } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale({
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                }
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({
                        ok: true
                    });
                } else {
                    return res.status(500).json(error)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}