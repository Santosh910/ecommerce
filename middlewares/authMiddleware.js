import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const requiredSign = async(req,res,next)=>{
    try{
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SEC
        );
        req.user = decode;
        next();
    }catch(error){
        console.log(error)
    }
}

export const isAdmin = async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).json({
                success:false,
                message:"UnAuthorized Access"
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            error,
            message:"Error in admin middleware"
        })
    }
}