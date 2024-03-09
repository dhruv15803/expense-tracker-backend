import jwt from 'jsonwebtoken'
import { ExpenseCategory } from '../models/expenseCategory.models.js';


// add expenseCategory controller

const addExpenseCategory = async (req,res) => {
try {
        const {expenseCategoryName} = req.body;
        if(expenseCategoryName.trim()===""){
            res.status(400).json({
                "success":false,
                "message":"category field is required"
            })
            return;
        }
        // adding category for logged in user
        if(!req.cookies?.accessToken){
            res.status(400).json({
                "success":false,
                "message":"user is not logged in"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        if(!decodedToken){
            res.status(500).json({
                "success":false,
                "message":"jwt error"
            })
            return;
        }

        // checking if expenseCategory already exists
        const category = await ExpenseCategory.findOne({name:expenseCategoryName.toLowerCase()})
        if(category){
            res.status(400).json({
                "success":false,
                "message":"expense category already exists"
            })
            return;
        }
        const name = await ExpenseCategory.create({name:expenseCategoryName.toLowerCase(),userId:decodedToken._id})
        if(!name){
            res.status(500).json({
                "success":false,
                "message":"db insertion error"
            })
            return;
        }
        res.status(201).json({
            "success":true,
            "message":"successfully added category",
            "expenseCategory":name,
        })
} catch (error) {
    console.log(error);
}
}

const getExpenseCategories = async (req,res) => {
try {
        if(!req.cookies?.accessToken){
            res.status(400).json({
                "success":false,
                "message":"user is not logged in"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        if(!decodedToken){
            res.status(500).json({
                "success":false,
                "message":"jwt error"
            })
            return;
        }
    
        const expenseCategories = await ExpenseCategory.find({userId:decodedToken._id});
        res.status(200).json({
            "success":true,
            expenseCategories,
        })
} catch (error) {
    console.log(error);
}
}




export {
    addExpenseCategory,
    getExpenseCategories,
}


