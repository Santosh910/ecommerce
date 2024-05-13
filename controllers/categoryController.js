import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
    try {
        const {
            name
        } = req.body;
        if (!name) {
            return res.status(401).json({
                message: "Name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({
            name
        });
        if (existingCategory) {
            return res.status(200).json({
                success: false,
                message: "category already exisits",
            })
        }
        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();

        return res.status(201).json({
            success: true,
            message: "new category created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Errro in Category",
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const {
            name
        } = req.body;
        const {
            id
        } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, {
            name,
            slug: slugify(name)
        }, {
            new: true
        });
         return res.status(200).json({
            success:true,
            message:"category updated successfully",category
         });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Errro while updating Category",
        });
    }
}

export const AllCategory = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        return res.status(200).json({
            success:true,
            message:"all categories list",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Errro while getting all Category",
        });
    }
}

export const singleCategory = async (req, res) => {
    try {
         const category = await categoryModel.findOne({slug:req.params.slug});
         return res.status(200).json({
            success:true,
            message:"get single category successfully",category
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Errro while getting single Category",
        });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"category deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Errro while delete Category",
        });
    }
}