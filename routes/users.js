const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")


//Update
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,
                {
                    //set is a method that sends everything in the req.body or the given params
                    $set: req.body
                },
                {
                    //this setting updates postman to show new updated user
                    new: true
                }
            );
            res.json({ message: "successful update", payload: updatedUser })
            
        } catch (err) {
            //500 error internal server error
            res.status(500).json(err)
        }
    } else {
        //401 error unauthorized
        res.status(401).json({message: "You can only update your account"})
    }
})

//Delete
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {

                await Post.deleteMany({username: user.username})
                await User.findByIdAndDelete(req.params.id)
                res.json({ message: "User has been deleted"})
            
            } catch (err) {
                res.status(500).json(err)
            }
        } catch (err) {
            //404 error not found
            res.status(404).json("User not found")
        }
    } else {
         //401 error unauthorized
        res.status(401).json({message: "You can only delete your account"})
    }
})

//get user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        //used to return all params except the password
        const { password, ...others } = user._doc
        res.json({message:"Successful", payload: others})
    } catch (err) {
         //500 error internal server error
        res.status(500).json(err)
    }
})

module.exports = router