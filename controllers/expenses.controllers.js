import jwt from "jsonwebtoken";
import { ExpenseCategory } from "../models/expenseCategory.models.js";
import { Expense } from "../models/expenses.models.js";

// add expenseCategory controller

const addExpenseCategory = async (req, res) => {
  try {
    const { expenseCategoryName } = req.body;
    if (expenseCategoryName.trim() === "") {
      res.status(400).json({
        success: false,
        message: "category field is required",
      });
      return;
    }
    // adding category for logged in user
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }

    // checking if expenseCategory already exists
    const category = await ExpenseCategory.findOne({
      name: expenseCategoryName.toLowerCase(),
      userId: decodedToken._id,
    });
    if (category) {
      res.status(400).json({
        success: false,
        message: "expense category already exists",
      });
      return;
    }
    const name = await ExpenseCategory.create({
      name: expenseCategoryName.toLowerCase(),
      userId: decodedToken._id,
    });
    if (!name) {
      res.status(500).json({
        success: false,
        message: "db insertion error",
      });
      return;
    }
    res.status(201).json({
      success: true,
      message: "successfully added category",
      expenseCategory: name,
    });
  } catch (error) {
    console.log(error);
  }
};

const getExpenseCategories = async (req, res) => {
  try {
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }

    const expenseCategories = await ExpenseCategory.find({
      userId: decodedToken._id,
    });
    res.status(200).json({
      success: true,
      expenseCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const addExpense = async (req, res) => {
  try {
    const { expenseTitle, expenseCategory, expenseAmount, expenseDate } =
      req.body;
    // need userId of logged in user
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in ",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt errror",
      });
      return;
    }
    if (expenseTitle.trim() === "") {
      res.status(400).json({
        success: false,
        message: "expense title is required",
      });
      return;
    }
    if (expenseAmount === 0) {
      res.status(400).json({
        success: false,
        message: "expense amount cannot be 0",
      });
      return;
    }
    if (expenseDate === "") {
      res.status(400).json({
        success: false,
        message: "please select a date",
      });
      return;
    }
    // get expenseCategoryId
    const category = await ExpenseCategory.findOne({
      name: expenseCategory,
      userId: decodedToken._id,
    });

    const expense = await Expense.create({
      expenseTitle,
      expenseAmount,
      expenseCategoryId: category._id,
      expenseDate,
      userId: decodedToken._id,
    });
    res.status(201).json({
      success: true,
      message: "successfully added expense",
      expense,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllExpenses = async (req, res) => {
  // send all expenses of logged in user
  try {
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }
    const expenses = await Expense.find({ userId: decodedToken._id });
    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.body;
    // need to be logged in to delete expense
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }
    // delete query for database
    await Expense.deleteOne({ _id: id, userId: decodedToken._id });
    res.status(200).json({
      success: true,
      message: "successfully deleted expense",
    });
  } catch (error) {
    console.log(error);
  }
};

const getExpenseCategoryNameById = async (req, res) => {
  try {
    const { expenseCategoryId } = req.body;
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }
    // db query
    const category = await ExpenseCategory.findOne({
      _id: expenseCategoryId,
      userId: decodedToken._id,
    });
    const name = category.name;
    res.status(200).json({
      success: true,
      name,
    });
  } catch (error) {
    console.log(error);
  }
};


const updateExpense = async (req,res) => {
try {
    const {id,newExpenseTitle,newExpenseAmount,newExpenseCategory,newExpenseDate} = req.body;
    console.log(req.body);
    // controller function :- to edit expense of logged in user with expenseId = id
    // step 1 :- get logged in user
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }
    // checking if new inputs are not empty
    if(newExpenseTitle.trim()==="" || newExpenseAmount===0  || newExpenseCategory.trim()==="" || newExpenseDate.trim()===""){
      res.status(400).json({
        "success":false,
        "message":"all fields are required"
      })
      return;
    }
  
    // getting categoryId from newCategoryName
    const category = await ExpenseCategory.findOne({name:newExpenseCategory,userId:decodedToken._id});
  
    await Expense.updateOne({_id:id,userId:decodedToken._id},{$set:{expenseTitle:newExpenseTitle,expenseAmount:newExpenseAmount,expenseCategoryId:category._id,expenseDate:newExpenseDate}})
  
    const newExpense = await Expense.findOne({_id:id,userId:decodedToken._id});
  
    res.status(200).json({
      "success":true,
      "message":"successfully updated expense",
      newExpense,
    })
} catch (error) {
  console.log(error);
}
}

const getSortedExpenses = async (req,res) => {
try {
    const {sortExpense} = req.body;
    // expenses for logged in user, 
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user is not logged in",
      });
      return;
    }
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        success: false,
        message: "jwt error",
      });
      return;
    }
    if(Number(sortExpense)===0){
      const expenses = await Expense.find({userId:decodedToken._id});
      res.status(200).json({
        "success":true,
        expenses,
      })
      return;
    }
    const expenses = await Expense.find({userId:decodedToken._id}).sort({expenseAmount:Number(sortExpense)})
    res.status(200).json({
      "success":true,
      expenses,
    })
} catch (error) {
  console.log(error);
}

}



export {
  addExpenseCategory,
  getExpenseCategories,
  addExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseCategoryNameById,
  updateExpense,
  getSortedExpenses,
};
