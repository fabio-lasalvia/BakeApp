import mongoose from "mongoose";

///// Import models /////
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Supplier from "../models/Supplier.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

///////////////////////////
///// GET - ALL USERS /////
///////////////////////////
export async function index(request, response, next) {
    try {
        const users = await User.find().select("-password").populate(["customer", "employee", "supplier"]);
        return response.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////
///// GET - SINGLE USER /////
/////////////////////////////
export async function show(request, response, next) {
    try {
        const user = await User.findById(request.params.id)
            .select("-password")
            .populate(["customer", "employee", "supplier"]);
        if (!user) return next(createError(404, "User not found"));
        return response.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

//////////////////////////////
///// POST - CREATE USER /////
//////////////////////////////
export async function create(request, response, next) {
    try {
        const { email, password, role, name, surname, phone, address, department, companyName, contact } = request.body;

        if (request.user.role !== "ADMIN" && role !== "CUSTOMER") {
            return next(createError(403, "You are not allowed to create this type of account"));
        }

        const existing = await User.findOne({ email });
        if (existing) return next(createError(400, "Email already registered"));

        const newUser = new User({ name, surname: surname || "", email, password, role });
        await newUser.save();

        if (role === "CUSTOMER" || !role) {
            await Customer.create({ user: newUser._id, phone, address });
        } else if (role === "EMPLOYEE") {
            await Employee.create({ user: newUser._id, department });
        } else if (role === "SUPPLIER") {
            await Supplier.create({ user: newUser._id, companyName, contact });
        }

        return response.status(201).json({
            message: "User created successfully",
            user: { id: newUser._id, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////
///// PUT - UPDATE USER /////
/////////////////////////////
export async function update(request, response, next) {
    try {
        const { email, role, name, surname, phone, address, department, companyName, contact } = request.body;

        const updatedUser = await User.findByIdAndUpdate(
            request.params.id,
            { name, surname: surname || "", email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return next(createError(404, "User not found"));

        if (role === "CUSTOMER") {
            await Customer.findOneAndUpdate({ user: request.params.id }, { phone, address });
        } else if (role === "EMPLOYEE") {
            await Employee.findOneAndUpdate({ user: request.params.id }, { department });
        } else if (role === "SUPPLIER") {
            await Supplier.findOneAndUpdate({ user: request.params.id }, { companyName, contact });
        }

        return response.status(200).json({
            message: "User successfully updated",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// DELETE - SINGLE USER /////
////////////////////////////////
export async function remove(request, response, next) {
    try {
        const deletedUser = await User.findByIdAndDelete(request.params.id);
        if (!deletedUser) return next(createError(404, "User not found"));

        await Customer.deleteOne({ user: request.params.id });
        await Employee.deleteOne({ user: request.params.id });
        await Supplier.deleteOne({ user: request.params.id });

        return response.status(200).json({
            message: "User successfully deleted",
            user: deletedUser,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////////////
///// PATCH - UPDATE USER ROLE /////
////////////////////////////////////
export async function updateRole(request, response, next) {
    try {
        const { role } = request.body;

        if (request.user.role !== "ADMIN") return next(createError(403, "Only admin can change roles"));

        const updatedUser = await User.findByIdAndUpdate(
            request.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return next(createError(404, "User not found"));

        return response.status(200).json({
            message: "User role updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}
