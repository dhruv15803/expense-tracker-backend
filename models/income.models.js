import mongoose from 'mongoose'


const incomeSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    incomeTitle:{
        type:String,
        required:true,
    },
    incomeStreamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"IncomeStream",
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Income = mongoose.model('Income',incomeSchema);