import mongoose from "mongoose";

///// Import models /////
import Customer from "../models/Customer.js";
import User from "../models/User.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

///////////////////////////////
///// GET - ALL CUSTOMERS /////
///////////////////////////////
export async function index(request, response, next) {
    try {
        const customers = await Customer.find().populate("user", "-password");
        return response.status(200).json(customers);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// GET - SINGLE CUSTOMER /////
/////////////////////////////////
export async function show(request, response, next) {
    try {
        const customer = await Customer.findById(request.params.id).populate("user", "-password");
        if (!customer) return next(createError(404, "Customer not found"));
        return response.status(200).json(customer);
    } catch (error) {
        next(error);
    }
}

//////////////////////////////////
///// POST - CREATE CUSTOMER /////
//////////////////////////////////
export async function create(request, response, next) {
    try {
        const { name, surname, email, password, phone, address } = request.body;

        const existing = await User.findOne({ email });
        if (existing) return next(createError(400, "Email already registered"));

        const user = await User.create({ name, surname, email, password, role: "CUSTOMER" });
        const customer = await Customer.create({ user: user._id, phone, address });

        user.customer = customer._id;
        await user.save();

        return response.status(201).json({
            message: "Customer created successfully",
            customer,
            user,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// PUT - UPDATE CUSTOMER /////
/////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const customer = await Customer.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!customer) return next(createError(404, "Customer not found"));
        return response.status(200).json({
            message: "Customer updated successfully",
            customer,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////
///// DELETE - CUSTOMER /////
/////////////////////////////
export async function remove(request, response, next) {
    try {
        const customer = await Customer.findByIdAndDelete(request.params.id);
        if (!customer) return next(createError(404, "Customer not found"));
        await User.findByIdAndDelete(customer.user);
        return response.status(200).json({
            message: "Customer deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
