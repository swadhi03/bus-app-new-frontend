const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { usermodel } = require("./models/user")
const { busmodel } = require("./model/bus")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://swathi:swathi2609@cluster0.em0miqo.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

//api for signUp
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let user = new usermodel(input)
    user.save()
    console.log(user)

    res.json({ "status": "success" })
})

app.post("/signin", (req, res) => {
    let input = req.body
    usermodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbPassword = response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.email }, "blog-app", { expiresIn: "1d" },
                            (error, token) => {
                                if (error) {
                                    res.json({ "ststus": "unable to create token" })
                                }
                                else {
                                    res.json({ "status": "success", "userId": response[0]._id, "token": token })
                                }
                            })
                    }
                    else {
                        res.json({ "status": "incorrect password" })
                    }
                })
            }
            else {
                res.json({ "status": "user not found" })
            }
        }
    ).catch()
})

app.post("/viewuser", (req, res) => {
    let token = req.headers["token"]
    jwt.verify(token, "blog-app", (error, decoded) => {
        if (error) {
            res.json({ "status": "unauthorized access" })
        } else {
            if (decoded) {
                usermodel.find().then(
                    (response) => {
                        res.json(response)
                    }
                ).catch()
            }
        }
    })
})

app.post("/add", (req, res) => {
    let input = req.body
    let bus = new busmodel(input)
    bus.save()
    console.log(bus)
    res.json({ "status": "success" })
})

app.post("/search",(req,res)=>{
    let input = req.body
    busmodel.find(input).then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

app.post("/view", (req, res) => {
    busmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    )

})

app.post("/delete",(req,res)=>{
    let input=req.body
    busmodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
})

app.listen(8080, () => {
    console.log("server Started")
})