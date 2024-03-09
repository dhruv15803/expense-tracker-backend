import mongoose from 'mongoose'


const incomeStreamSchema = new mongoose.Schema({
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


export const IncomeStream = mongoose.model('IncomeStream',incomeStreamSchema);








