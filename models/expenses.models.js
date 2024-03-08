import mongoose from 'mongoose'


const expenseSchema = new mongoose.Schema({
    amount: {
        type:Number,
        required:true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});

export const Expense = mongoose.model('Expense',expenseSchema);
