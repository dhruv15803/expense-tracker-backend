import { User } from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({
  path: "../.env",
});

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dqcptinzd",
  api_key: "792156251912376",
  api_secret: "jkxJ8U74dhrEtqWczC3_aTczQrw",
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }
    console.log(req.file);
    const avatarUrl = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    console.log(avatarUrl.url);
    // checking if user already is registered
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });
    if (user) {
      res.status(400).json({
        success: false,
        message: "account already exists with username or email",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatarUrl.url,
    });
    console.log(newUser);
    // checking if user is correctly inserted in the users db
    const checkUser = await User.findOne({ email: newUser.email });
    if (!checkUser) {
      res.status(500).json({
        success: false,
        message: "db insertion error",
      });
      return;
    }
    res.status(201).json({
      success: true,
      message: "successfully registered user",
    });
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (email.trim() === "" || password.trim() === "") {
      res.status(400).json({
        success: false,
        message: "All fields are requried",
      });
      return;
    }
    // checking if user is already logged in
    if (req.cookies?.accessToken) {
      res.status(500).json({
        success: false,
        message: "user is already logged in",
      });
      return;
    }
    // Checking if a user is registered with the email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "user with this email does not exist",
      });
      return;
    }
    // checking if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "incorrect password",
      });
      return;
    }
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );
    res.cookie("accessToken", token, {
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getLoggedInUser = async (req, res) => {
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
        message: "something went wrong when verifying",
      });
      return;
    }
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) {
      res.status(500).json({
        success: false,
        message: "something went wrong with user db",
      });
      return;
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    // for a user to logout , one needs to be logged in
    // check if user is logged in
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
    // making sure logged in user is part of the users db
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) {
      res.status(500).json({
        success: false,
        message: "user does not exist in db",
      });
      return;
    }
    res.clearCookie("accessToken");
    console.log(req.cookies);
    res.status(200).json({
      success: true,
      message: "successfully logged out",
    });
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    // need to be logged in to change username and password
    if (!req.cookies?.accessToken) {
      res.status(400).json({
        success: false,
        message: "user not logged in",
      });
      return;
    }
    //get logged in user
    const decodedToken = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET
    );
    if (!decodedToken) {
      res.status(500).json({
        sucess: false,
        message: "jwt error",
      });
      return;
    }
    // username can only be changed when no other username in db clashes with the newUsername
    const user = await User.findOne({ username: newUsername });
    if (user) {
      res.status(400).json({
        success: false,
        message: "new username already taken",
      });
      return;
    }
    // hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: decodedToken._id },
      { $set: { username: newUsername, password: hashedPassword } }
    );
    res.status(200).json({
      success: true,
      message: "successfully updated user",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAvatarUrl = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "file not uploaded",
      });
      return;
    }
    console.log(req.file);
    const { url } = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    if (!url) {
      res.status(500).json({
        success: false,
        message: "cloudinary error",
      });
      return;
    }
    res.status(200).json({
      success: true,
      url,
    });
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
  }
};


const editUsername = async (req,res) => {
try {
        const {newUsername }  = req.body;
        if(newUsername.trim()===""){
          res.status(400).json({
            "success":true,
            "message":"username field is required"
          })
          return;
        }
        if(!req.cookies?.accessToken) {
            res.status(400).json({
                "success":false,
                "message":"user not logged in"
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
        // check if user with new username doesn't exist
        const user = await User.findOne({username:newUsername.toLowerCase()});
        if(user) {
            res.status(400).json({
                "success":false,
                "message":"username already exists"
            })
            return;
        }
        await User.updateOne({_id:decodedToken._id},{$set:{username:newUsername.toLowerCase()}})
        // updated user
        const updatedUser = await User.findOne({_id:decodedToken._id})
        res.status(200).json({
            "success":true,
            "message":"successfully updated username",
            updatedUser,
        })
} catch (error) {
    console.log(error);
}
}


const editPassword = async (req,res) => {
try {
        const {newPassword} = req.body;
        if(newPassword.trim()===""){
          res.status(400).json({
            "success":false,
            "message":"password field is required"
          })
          return;
        }
        if(!req.cookies?.accessToken) {
            res.status(400).json({
                "success":false,
                "message":"user not logged in"
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
        const hashedNewPassword = await bcrypt.hash(newPassword,10);
        await User.updateOne({_id:decodedToken._id},{$set:{password:hashedNewPassword}});
        // sending user with updated password in response
        const user = await User.findOne({_id:decodedToken._id});
        res.status(200).json({
            "success":true,
            "message":"successfully updated password",
            user,
        })
} catch (error) {
    console.log(error);
}
}

const editAvatar = async (req,res) => {

try {
    if(!req.cookies?.accessToken) {
      res.status(400).json({
          "success":false,
          "message":"user not logged in"
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

  if(!req.file){
    res.status(400).json({
      "success":false,
      "message":"no new avatar file"
    })
    return;
  }

  console.log(req.file.path);
  const {url} = await cloudinary.uploader.upload(req.file.path,{
    resource_type:"auto"
  })
  
  await User.updateOne({_id:decodedToken._id},{$set:{avatar:url}});
  const newUser = await User.findOne({_id:decodedToken._id});
  res.status(200).json({
    "success":true,
    "message":"successfully updated user avatar",
    user:newUser,
  })
  fs.unlinkSync(req.file.path);
} catch (error) {
  console.log(error);
}

}


export {
  registerUser,
  loginUser,
  getLoggedInUser,
  logoutUser,
  editUser,
  getAvatarUrl,
  editUsername,
  editPassword,
  editAvatar
};
