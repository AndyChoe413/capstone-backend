const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true.valueOf,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: false,
    },
    location: {
        lat: Number,
        lng: Number
    }
},
     {timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema)