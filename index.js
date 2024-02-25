import dotenv from "dotenv"
import connectDB from "./src/db/index.js"
import { app } from "./src/app.js"

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        try {
            app.listen(process.env.PORT || 6000, () => {
                console.log(` Server is running at port : ${process.env.PORT}`)
            })
        } catch (error) {
            console.log("Some Error in server listen", error)
        }
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err)
    })
