dotenv.config({
  path: "./.env",
});
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  editAvatar,
    editPassword,
  editUser,
  editUsername,
  getAvatarUrl,
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./controllers/users.controllers.js";
import multer from "multer";
import { addExpense, addExpenseCategory, deleteExpense, getAllExpenses, getExpenseCategories, getExpenseCategoryNameById, updateExpense } from "./controllers/expenses.controllers.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const connectToDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/expenseTracker`);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("DB ERROR:- ", error);
  }
};
const app = express();

connectToDb();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// user routes
app.post("/user/registerUser", upload.single("avatar"), registerUser);
app.post("/user/loginUser", loginUser);
app.get("/user/getLoggedInUser", getLoggedInUser);
app.get("/user/logoutUser", logoutUser);
app.patch("/user/editUser", editUser);
app.post("/user/getAvatar", upload.single("avatar"), getAvatarUrl);
app.patch('/user/editUsername',editUsername);
app.patch('/user/editPassword',editPassword);
app.patch('/user/editAvatar',upload.single('newAvatar'),editAvatar);


// expenses routes
app.post('/expense/addExpenseCategory',addExpenseCategory);
app.get('/expense/getExpenseCategories',getExpenseCategories);
app.post('/expense/add',addExpense);
app.get('/expense/getAllExpenses',getAllExpenses);
app.post('/expense/deleteExpense',deleteExpense);
app.post('/expense/getExpenseCategoryNameById',getExpenseCategoryNameById);
app.patch('/expense/updateExpense',updateExpense);

app.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`);
});
