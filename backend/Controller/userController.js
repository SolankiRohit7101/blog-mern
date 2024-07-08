import userModel from "../Model/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwt.js";
import {
  registerSchema,
  LoginSchema,
  nameschema,
  passwordschema,
} from "../utils/ValidbotSchema.js";
import { ZodError } from "zod";
import { Types } from "mongoose";

export const registerUser = async (req, res, next) => {
  try {
    let isValidData = registerSchema.parse(req.body);
    let { name, password, email, profile_image, bio } = isValidData;

    if (!profile_image) {
      profile_image =
        "https://res.cloudinary.com/dyxijouqy/image/upload/f_auto,q_auto/v1/blog_profile/dfanyr2nh3h4pwbkecmp";
    }
    let isemail = email.includes("@gmail.com")
      ? email.replace("@gmail.com", "@email.com")
      : email.replace("@email.com", "@gmail.com");
    const IsUser = await userModel.findOne({ isemail });
    const isUser = await userModel.findOne({ email });
    if (isUser || IsUser)
      return next(new ErrorHandler(401, "mail already registered with us."));
    const hashPassword = bcrypt.hashSync(password, 8);
    const user = await userModel({
      name,
      bio,
      password: hashPassword,
      email,
      profile_image,
    });
    await user.save();
    jwtToken(res, user, "successfully register");
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ErrorHandler(400, error.errors[0].message));
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const isValidData = LoginSchema.parse(req.body);
    let { email, password } = isValidData;
    let isemail = email.includes("@gmail.com")
      ? email.replace("@gmail.com", "@email.com")
      : email.replace("@email.com", "@gmail.com");
    const IsUser = await userModel.findOne({ isemail });
    const isUser = await userModel.findOne({ email });
    if (!isUser && !IsUser) {
      return next(new ErrorHandler(403, "Invalid Credentials"));
    } else {
      const isPassword = await bcrypt.compare(password, isUser.password);
      if (!isPassword) {
        return next(new ErrorHandler(403, "Invalid Credentials"));
      } else {
        return jwtToken(res, isUser, "successfully login");
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ErrorHandler(400, error.errors[0].message));
    }
    next(error);
  }
};
export const updateProfileUser = async (req, res, next) => {
  try {
    let { name, password, bio, profile_image } = req.body;
    let validName, validPassword;
    if (name) {
      validName = nameschema.parse(name);
    }
    if (password) {
      validPassword = passwordschema.parse(password);
    }
    let userId = req.user;
    userId = new Types.ObjectId(userId);
    const updateUserData = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        ...(name && { name }),
        ...(password && { password }),
        ...(bio && { bio }),
        ...(profile_image && { profile_image }),
      },
      { new: true }
    );
    return jwtToken(res, updateUserData, "successfully updated data", next);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ErrorHandler(400, error.errors[0].message));
    }
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  return res
    .cookie("accessToken", req.cookies.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0,
      path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "logout successfully",
    });
};
