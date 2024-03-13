import { Income } from "../models/income.models.js";
import { IncomeCategory } from "../models/incomeCategory.models.js";
import jwt from "jsonwebtoken";

const addIncomeCategory = async (req, res) => {
  try {
    const { incomeCategoryName } = req.body;
    if (incomeCategoryName.trim() === "") {
      res.status(400).json({
        success: false,
        message: "add income field is empty",
      });
      return;
    }
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
    const category = await IncomeCategory.create({
      name: incomeCategoryName,
      userId: decodedToken._id,
    });
    res.status(200).json({
      success: true,
      message: "successfully added income category",
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

const getIncomeCategories = async (req, res) => {
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
    const incomeCategories = await IncomeCategory.find({
      userId: decodedToken._id,
    });
    res.status(200).json({
      success: true,
      incomeCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const addIncome = async (req, res) => {
  try {
    const { incomeTitle, incomeAmount, incomeDate, incomeCategory } = req.body;
    if (
      incomeTitle.trim() === "" ||
      Number(incomeAmount) === 0 ||
      incomeDate.trim() === ""
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }
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
    //   get incomeCategoryId from incomeCategory
    const { _id } = await IncomeCategory.findOne({
      name: incomeCategory,
      userId: decodedToken._id,
    });

    // inserting date in income
    const income = await Income.create({
      incomeTitle,
      incomeAmount: Number(incomeAmount),
      incomeDate,
      incomeCategoryId: _id,
      userId: decodedToken._id,
    });
    res.status(200).json({
      success: true,
      message: "successfully added income",
      income,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllIncomes = async (req, res) => {
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
    const incomes = await Income.find({ userId: decodedToken._id });
    res.status(200).json({
      success: true,
      incomes,
    });
  } catch (error) {
    console.log(error);
    l;
  }
};

const getIncomeCategoryNameById = async (req, res) => {
  try {
    const { incomeCategoryId } = req.body;
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
    const { name } = await IncomeCategory.findOne({
      _id: incomeCategoryId,
      userId: decodedToken._id,
    });
    res.status(200).json({
      success: true,
      categoryName: name,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
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
    await Income.deleteOne({ _id: id, userId: decodedToken._id });
    res.status(200).json({
      success: true,
      message: "successfully deleted income",
    });
  } catch (error) {
    console.log(error);
  }
};

const updateIncome = async (req, res) => {
  try {
    const {
      newIncomeTitle,
      newIncomeAmount,
      newIncomeCategory,
      newIncomeDate,
      id,
    } = req.body;
    if (
      newIncomeTitle.trim() === "" ||
      Number(newIncomeAmount) === 0 ||
      newIncomeDate === ""
    ) {
      res.status(200).json({
        success: false,
        message: "all fields are neccessary",
      });
      return;
    }
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
    //   get categoryId for new income category
    const category = await IncomeCategory.findOne({
      name: newIncomeCategory,
      userId: decodedToken._id,
    });
    const { _id } = category;
    await Income.updateOne(
      { _id: id, userId: decodedToken._id },
      {
        $set: {
          incomeTitle: newIncomeTitle,
          incomeAmount: Number(newIncomeAmount),
          incomeCategoryId: _id,
          incomeDate: newIncomeDate,
        },
      }
    );
    //   updated income
    const income = await Income.findOne({ _id: id, userId: decodedToken._id });

    res.status(200).json({
      success: false,
      message: "updated successfully",
      income,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSortedIncomes = async (req, res) => {
  try {
    const { sortIncome } = req.body;
    let sortIncomeNum = Number(sortIncome);
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
    if (sortIncomeNum === 0) {
      const incomes = await Income.find({ userId: decodedToken._id });
      res.status(200).json({
        success: true,
        incomes,
      });
      return;
    }
    const incomes = await Income.find({ userId: decodedToken._id }).sort({
      incomeAmount: sortIncomeNum,
    });
    res.status(200).json({
      success: true,
      incomes,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSortedIncomesByDate = async (req, res) => {
  try {
    const { sortIncomeDate } = req.body;
    let sortIncomeDateNum = Number(sortIncomeDate);
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
    if (sortIncomeDateNum === 0) {
      const incomes = await Income.find({ userId: decodedToken._id });
      res.status(200).json({
        success: true,
        incomes,
      });
      return;
    }
    const incomes = await Income.find({ userId: decodedToken._id }).sort({
      incomeDate: sortIncomeDateNum,
    });
    res.status(200).json({
      success: true,
      incomes,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  addIncomeCategory,
  getIncomeCategories,
  addIncome,
  getAllIncomes,
  getIncomeCategoryNameById,
  deleteIncome,
  updateIncome,
  getSortedIncomes,
  getSortedIncomesByDate,
};
