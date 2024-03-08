import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { editUser, getLoggedInUser, loginUser, logoutUser, registerUser } from './controllers/users.controllers.js'

dotenv.config({
    path:'./.env'
})

const connectToDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/expenseTracker`);
        console.log('DB CONNECTED');
    } catch (error) {
        console.log('DB ERROR:- ',error)
    }
}
const app = express();

connectToDb();

// middlewares
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())


// user routes
app.post('/user/registerUser',registerUser);
app.post('/user/loginUser',loginUser);
app.get('/user/getLoggedInUser',getLoggedInUser);
app.get('/user/logoutUser',logoutUser);
app.patch('/user/editUser',editUser);


app.listen(process.env.PORT,()=>{
    console.log(`server running at http://localhost:${process.env.PORT}`)
})