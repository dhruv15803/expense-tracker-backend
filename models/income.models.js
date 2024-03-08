import mongoose from 'mongoose'


const incomeSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Income = mongoose.model('Income',incomeSchema);