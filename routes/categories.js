const router = require("express").Router()
const Category = require("../models/Category")

router.post("/", async (req, res) => {
console.log(req.body);
    const newCat = new Category(req.body)
    try {
        const savedCategory = await newCat.save()
        res.json({message: "New category added", payload:savedCategory})
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/", async (req, res) => {

    try {
        const getAllCats = await Category.find()
        console.log(getAllCats)
        res.json({ message: "success", payload: getAllCats})
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router