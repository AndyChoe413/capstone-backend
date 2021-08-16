const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")

//Create new post
router.post("/", async (req, res) => {

    const newPost = new Post(req.body)

        try {
            const savedPost = await newPost.save()
            res.json({message: "successful update", payload: savedPost})
        } catch (err) {
            //500 error internal server error
            res.status(500).json(err)
        }  
})

//Update Post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        console.log(post)

        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body
                    },
                    {
                        new: true
                    }
                );
                res.json({message: "successfully updated post", payload: updatedPost})
            } catch (err) {
                //internal server error
                res.status(500).json(err)    
            }
        } else {
             //401 error unauthorized    
           res.status(401).json({message: "you can only update your own posts"})
        }
    } catch (err) {
        //500 internal server error
         res.status(500).json(err)       
    }
})

//Delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log(post)
        // console.log(req.body.username)
        if (post) {
            try {
                await post.delete()
                res.json({ message: "successfully deleted post" })
            } catch (err) {
                //internal server error
                res.status(500).json(err)    
            }
        } else {
             //401 error unauthorized    
           res.status(401).json({message: "you can only delete your own posts"})
        }
    } catch (err) {
        //500 internal server error
         res.status(500).json(err)       
    }
})

//Get post
router.get("/findPostById/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json({payload: post})
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get all posts
router.get("/:username", async (req, res) => {

    try {
        const posts = await Post.find({username: req.params.username})
        console.log(req.params)
        res.json({payload:posts})
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router