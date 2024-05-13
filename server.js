import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import morgan from "morgan";
import cors  from 'cors'
import router from "./routes/index.js";

const app = express()
dotenv.config()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send({
        message:"welcome to ecommer app"
    })
})

app.use("/api/v1",router)

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Database connected"))

const PORT = 5000 || process.env.PORT

app.listen(PORT,()=>console.log(`app is run on ${PORT}`))