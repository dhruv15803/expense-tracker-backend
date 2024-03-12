import mongoose from 'mongoose'


const incomeCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})


export const IncomeCategory = mongoose.model('IncomeCategory',incomeCategorySchema);








