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
import productImageRouter from "./routes/productImage.route.js"
import categoryRouter from "./routes/category.route.js"
import materialRouter from "./routes/material.route.js"
import finishRouter from "./routes/finish.route.js"

//routes declaration
app.use("/api/v", userRouter)
app.use("/api/v1", productRouter)
app.use("/api/v2", productOptionRouter)
app.use("/api/v3", aboutusRouter)
app.use("/api/v4", contactusRouter)
app.use("/api/v5", productImageRouter)
app.use("/api/v6", categoryRouter)
app.use("/api/v7", materialRouter)
app.use("/api/v8", finishRouter)


export { app }