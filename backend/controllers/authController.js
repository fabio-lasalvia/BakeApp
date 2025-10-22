import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Supplier from "../models/Supplier.js";
import { signJWT } from "../helpers/jwt.js";
import mailer from "../helpers/mailer.js";
import { createError } from "../helpers/createError.js";

/////////////////////////////
///// SIGNUP (Customer) /////
/////////////////////////////
export async function signup(request, response, next) {
  try {
    const { name, surname, email, password, phone, address } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "This email is already registered"));
    }

    const user = await User.create({
      name,
      surname,
      email,
      password,
      role: "CUSTOMER",
    });

    const customer = await Customer.create({
      user: user._id,
      phone,
      address,
    });

    user.customer = customer._id;
    await user.save();

    await mailer.sendMail({
      to: email,
      subject: "Welcome to MyBakeApp 🎂",
      html: `<p>Hi ${name}, your account has been successfully created!</p>`,
      from: process.env.EMAIL_USER,
    });

    const token = signJWT({ id: user._id, role: user.role });
    return response
      .status(201)
      .json({ message: "User successfully registered", token, user });
  } catch (error) {
    next(error);
  }
}

/////////////////
///// LOGIN /////
/////////////////
export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(createError(400, "Incorrect email or password"));

    const token = signJWT({ id: user._id, role: user.role });

    return response.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

////////////////////////
///// GOOGLE LOGIN /////
////////////////////////
export async function googleLogin(request, response, next) {
  try {
    const { googleId, email, name, surname } = request.body;

    let user = await User.findOne({ googleId });

    if (!user) {
      const existingEmailUser = await User.findOne({ email });

      if (existingEmailUser) {
        existingEmailUser.googleId = googleId;
        await existingEmailUser.save();
        user = existingEmailUser;
      } else {
        user = await User.create({
          name,
          surname,
          email,
          googleId,
          role: "CUSTOMER",
        });

        const customer = await Customer.create({ user: user._id });
        user.customer = customer._id;
        await user.save();

        await mailer.sendMail({
          to: email,
          subject: "Welcome to MyBakeApp 🎂",
          html: `<p>Hi ${name || "User"}, welcome to MyBakeApp via Google login!</p>`,
          from: process.env.EMAIL_USER,
        });
      }
    }

    const token = signJWT({ id: user._id, role: user.role });
    return response
      .status(200)
      .json({ message: "Google login successful", token, user });
  } catch (error) {
    next(error);
  }
}
