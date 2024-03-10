import mongoose from 'mongoose'


const expenseSchema = new mongoose.Schema({
    expenseTitle: {
        type:String,
        required:true,
    },
    expenseCategoryId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"ExpenseCategory",
    },
    expenseAmount: {
        type:Number,
        required:true,
    },
    expenseDate: {
        type:String,
        required:true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});

export const Expense = mongoose.model('Expense',expenseSchema);
