import mongoose from 'mongoose'

const expenseCategorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})

export const ExpenseCategory = mongoose.model('Expense',expenseCategorySchema);