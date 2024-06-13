const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const  {usermodel} = require("./models/user")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://swathi:swathi2609@cluster0.em0miqo.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

//api for signUp
app.post("/signup",async (req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let user = new usermodel(input)
    user.save()
    console.log(user)

    res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("server Started")
})