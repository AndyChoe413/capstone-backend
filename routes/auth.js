const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    console.log(req.body)
    
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //saved through mongoose
        const user = await newUser.save()

        let jwtToken = jwt.sign({
            username: user.username,
            email: user.email
        }, process.env.PRIVATE_JWT_KEY,
            {
                expiresIn: "1d"
            }
        )
        
        console.log(jwtToken)

        console.log(user)
        res.json({ message: "success user created", payload: jwtToken })
        
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.post("/login", async (req, res) => {
    console.log(req.body)
    try {
        //User is brought in from the model schema User
        const foundUser = await User.findOne({ username: req.body.username })
        console.log(foundUser)

        if (!foundUser) {
            res.status(400).json({ message: "Failed login", payload: "Please check Info" })
        } else {

            const validateUser = await bcrypt.compare(req.body.password, foundUser.password)
            
            if (!validateUser) {
                res.status(400).json({ message: "Failed login", payload: "Please check credentials" })
            }

            let jwtToken = jwt.sign({
                 //foundUser brought in from above const foundUser = await User.findOne({ username: req.body.username })
                username: foundUser.username,
                email: foundUser.email
            }, process.env.PRIVATE_JWT_KEY,
                {
                    expiresIn: "1d"
                }
        )

            //returns everything in the objects except the password 
            const { password, ...others } = foundUser._doc
            
            res.json({message: "successful login", payload: jwtToken})
        }
    } catch (e) {
        
        res.status(500).json(e)
    }
})

module.exports = router