import mongoose from 'mongoose'


const incomeSchema = new mongoose.Schema({
    incomeAmount:{
        type:Number,
        required:true,
    },
    incomeTitle:{
        type:String,
        required:true,
    },
    incomeCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"IncomeStream",
    },
    incomeDate:{
        type:String,
        required:true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Income = mongoose.model('Income',incomeSchema);