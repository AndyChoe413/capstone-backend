const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const morgan = require("morgan")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer")
const cors = require("cors")

const app = express()

//------middleware-------//
dotenv.config()
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

//middleware used to upload files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        callback(null, "image.jpeg")
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.json({message: "file has been uploaded successfully"})
})

//-------server---------//
const port = 3001
mongoose
    .connect(process.env.MONGO_DB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
    .then(console.log(`Server connected to port ${port}`))
    .catch((err) => console.log(err));


//-------pre determined url routes--------//
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)


app.listen(port, () => {
    console.log('MONGODB connected')
})



