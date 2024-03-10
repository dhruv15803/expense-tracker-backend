import mongoose from 'mongoose'

const expenseCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})

export const ExpenseCategory = mongoose.model('ExpenseCategory',expenseCategorySchema);