import mongoose from 'mongoose'


const incomeStreamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})


export const IncomeStream = mongoose.model('IncomeStream',incomeStreamSchema);








