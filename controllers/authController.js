import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt'
import orderModel from "../models/orderModel.js";

export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            answer
        } = req.body.inputs;
        if (!name || !email || !password || !phone || !address || !answer) return res.status(401).json({
            success: false,
            message: "all data is mandotory"
        });

        const existingUser = await userModel.findOne({
            email
        })
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "Already register please login"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const user = await new userModel({
            name,
            email,
            password: hashedPass,
            phone,
            address,
            answer
        }).save();

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in registeration",
            error
        })
    }
}

export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body.inputs;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const user = await userModel.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "email is not registered"
            })
        }

        const isPassCo = await bcrypt.compare(password, user.password)
        if (!isPassCo) {
            return res.status(200).json({
                success: false,
                message: "Invalid Password",
            })
        }

        const token = await JWT.sign({
            _id: user._id
        }, process.env.JWT_SEC, {
            expiresIn: "7d"
        })

        return res.status(200).json({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in login",
            error
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {
            email,
            answer,
            newPassword
        } = req.body.inputs;
        if (!email || !answer || !newPassword) return res.status(404).json({
            success: false,
            message: "all fields are mandotory"
        })

        const user = await userModel.findOne({
            email,
            answer
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "wrong email or answer"
            })
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(user._id, {
            password: hashed
        });
        return res.status(200).json({
            success: true,
            message: "password reset successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

export const testController = async (req, res) => {
    try {
        res.send("protected routes")
    } catch (error) {
        console.log(error);
        res.send({
            error
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            phone
        } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({
                error: "Password is required and 6 character long"
            });

        }

        const hashedPass = password ? await bcrypt.hash(password, 10) : undefined;
        const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPass || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, {
            new: true
        });
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updateUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            buyer: req.user._id
        }).populate("products", "-photo").populate("buyer", "name");
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({
                createdAt: -1
            });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}

export const orderStatus = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const {
            status
        } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId, {
                status
            }, {
                new: true
            }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
}