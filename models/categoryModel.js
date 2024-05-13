import mongoose, { Schema } from "mongoose";

const category = new Schema({
    name:{
        type:String,

    },
    slug:{
        type:String,
        lowercase:true,
    }
})

export default mongoose.model("Category",category);