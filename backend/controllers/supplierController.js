import mongoose from "mongoose";

///// Import models /////
import Supplier from "../models/Supplier.js";
import User from "../models/User.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

///////////////////////////////
///// GET - ALL SUPPLIERS /////
///////////////////////////////
export async function index(request, response, next) {
    try {
        const suppliers = await Supplier.find().populate("user", "-password");
        return response.status(200).json(suppliers);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// GET - SINGLE SUPPLIER /////
/////////////////////////////////
export async function show(request, response, next) {
    try {
        const supplier = await Supplier.findById(request.params.id).populate("user", "-password");
        if (!supplier) return next(createError(404, "Supplier not found"));
        return response.status(200).json(supplier);
    } catch (error) {
        next(error);
    }
}

//////////////////////////////////
///// POST - CREATE SUPPLIER /////
//////////////////////////////////
export async function create(request, response, next) {
    try {
        const { name, surname, email, password, companyName, contact, vatNumber } = request.body;

        const existing = await User.findOne({ email });
        if (existing) return next(createError(400, "Email already registered"));

        const user = await User.create({ name, surname, email, password, role: "SUPPLIER" });
        const supplier = await Supplier.create({ user: user._id, companyName, contact, vatNumber });

        user.supplier = supplier._id;
        await user.save();

        return response.status(201).json({
            message: "Supplier created successfully",
            supplier,
            user,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// PUT - UPDATE SUPPLIER /////
/////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const supplier = await Supplier.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!supplier) return next(createError(404, "Supplier not found"));
        return response.status(200).json({
            message: "Supplier updated successfully",
            supplier,
        });
    } catch (error) {
        next(error);
    }
}

/////////////////////////////
///// DELETE - SUPPLIER /////
/////////////////////////////
export async function remove(request, response, next) {
    try {
        const supplier = await Supplier.findByIdAndDelete(request.params.id);
        if (!supplier) return next(createError(404, "Supplier not found"));
        await User.findByIdAndDelete(supplier.user);
        return response.status(200).json({
            message: "Supplier deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
