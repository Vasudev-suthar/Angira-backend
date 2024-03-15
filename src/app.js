import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


//routes import
import productRouter from "./routes/product.route.js"
import productOptionRouter from "./routes/productOption.route.js"
import userRouter from "./routes/user.route.js"
import aboutusRouter from "./routes/aboutus.route.js"
import contactusRouter from "./routes/contactus.route.js"

//routes declaration
app.use("/api/v", userRouter)
app.use("/api/v1", productRouter)
app.use("/api/v2", productOptionRouter)
app.use("/api/v3", aboutusRouter)
app.use("/api/v4", contactusRouter)


export { app }