import mongoose from "mongoose";

///// Import models /////
import Employee from "../models/Employee.js";
import User from "../models/User.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

///////////////////////////////
///// GET - ALL EMPLOYEES /////
///////////////////////////////
export async function index(request, response, next) {
    try {
        const employees = await Employee.find().populate("user", "-password");
        return response.status(200).json(employees);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// GET - SINGLE EMPLOYEE /////
/////////////////////////////////
export async function show(request, response, next) {
    try {
        const employee = await Employee.findById(request.params.id).populate("user", "-password");
        if (!employee) return next(createError(404, "Employee not found"));
        return response.status(200).json(employee);
    } catch (error) {
        next(error);
    }
}

//////////////////////////////////
///// POST - CREATE EMPLOYEE /////
//////////////////////////////////
export async function create(request, response, next) {
    try {
        const { name, surname, email, password, department } = request.body;

        const existing = await User.findOne({ email });
        if (existing) return next(createError(400, "Email already registered"));

        const user = await User.create({ name, surname, email, password, role: "EMPLOYEE" });
        const employee = await Employee.create({ user: user._id, name, department });

        user.employee = employee._id;
        await user.save();

        return response.status(201).json({
            message: "Employee created successfully",
            employee,
            user,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// PUT - UPDATE EMPLOYEE /////
/////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const employee = await Employee.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!employee) return next(createError(404, "Employee not found"));
        return response.status(200).json({
            message: "Employee updated successfully",
            employee,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////
///// DELETE - EMPLOYEE /////
/////////////////////////////
export async function remove(request, response, next) {
    try {
        const employee = await Employee.findByIdAndDelete(request.params.id);
        if (!employee) return next(createError(404, "Employee not found"));
        await User.findByIdAndDelete(employee.user);
        return response.status(200).json({
            message: "Employee deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
