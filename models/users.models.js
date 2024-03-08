import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    avatar: {
        type:String,
        required:true,
    },
    username: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password: {
        type:String,
        required:true,
    }
},{timestamps:true})

export const User = mongoose.model('User',userSchema);