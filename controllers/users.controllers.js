import { User } from "../models/users.models.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config({
    path:"../.env"
})


const registerUser = async (req,res) => {
try {
        const {username,email,password} = req.body;
        if(username.trim()==="" || email.trim()==="" || password.trim()===""){
            res.status(400).json({
                "success":false,
                "message":"All fields are required",
            })
            return;
        }
        // checking if user already is registered
        const user = await User.findOne({$or:[{username:username.toLowerCase()},{email:email.toLowerCase()}]});
        if(user) {
            res.status(400).json({
                "success":false,
                "message":"account already exists with username or email",
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({username:username.toLowerCase(),email:email.toLowerCase(),password:hashedPassword});
        console.log(newUser);
        // checking if user is correctly inserted in the users db
        const checkUser = await User.findOne({email:newUser.email});
        if(!checkUser) {
            res.status(500).json({
                "success":false,
                "message":"db insertion error"
            })
            return;
        }
        res.status(201).json({
            "success":true,
            "message":"successfully registered user",
        })
} catch (error) {
    console.log(error);
}
}


const loginUser = async (req,res) => {
    try {
    const {email,password} = req.body;
    console.log(req.body);
    if(email.trim()==="" || password.trim()===""){
        res.status(400).json({
            "success":false,
            "message":"All fields are requried"
        })
        return;
    }
    // checking if user is already logged in 
    if(req.cookies?.accessToken){
        res.status(500).json({
            "success":false,
            "message":"user is already logged in"
        })
        return;
    }
    // Checking if a user is registered with the email
    const user = await User.findOne({email:email.toLowerCase()});
    if(!user) {
        res.status(400).json({
            "success":false,
            "message":"user with this email does not exist"
        })
        return;
    }
    // checking if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        res.status(400).json({
            "success":false,
            "message":"incorrect password",
        })
        return;
    }
    const token = jwt.sign({
        _id:user._id,
        username:user.username,
        email:user.email,
        password:user.password,
    },process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
    res.cookie('accessToken',token,{
        httpOnly:true,
    })
    res.status(200).json({
        "success":true,
        "message":"user logged in successfully"
    })
    } catch (error) {
      console.log(error);  
    }
}


const getLoggedInUser = async (req,res) => {
try {
        if(!req.cookies?.accessToken) {
            res.status(400).json({
                "success":false,
                "message":"user is not logged in"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        if(!decodedToken) {
            res.status(500).json({
                "success":false,
                "message":"something went wrong when verifying"
            })
            return;
        }
        const user = await User.findOne({_id:decodedToken._id});
        if(!user) {
            res.status(500).json({
                "success":false,
                "message":"something went wrong with user db"
            })
            return;
        }
        res.status(200).json({
            "success":true,
            user,
        })
} catch (error) {
    console.log(error);
}
}


const logoutUser = async (req,res) => {
try {
        // for a user to logout , one needs to be logged in 
        // check if user is logged in
        if(!req.cookies?.accessToken) {
            res.status(400).json({
                "success":false,
                "message":"user is not logged in"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        if(!decodedToken) {
            res.status(500).json({
                "success":false,
                "message":"jwt error"
            })
            return;
        }
        // making sure logged in user is part of the users db
        const user = await User.findOne({_id:decodedToken._id});
        if(!user) {
            res.status(500).json({
                "success":false,
                "message":"user does not exist in db"
            })
            return;
        }
        res.clearCookie('accessToken');
        console.log(req.cookies);
        res.status(200).json({
            "success":true,
            "message":"successfully logged out"
        })
} catch (error) {
    console.log(error);
}
}


export {registerUser,loginUser,getLoggedInUser,logoutUser};