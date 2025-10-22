import mongoose from "mongoose";

///// Import models /////
import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Employee from "../models/Employee.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

/////////////////////////////////////
///// GET - ALL PURCHASE ORDERS /////
/////////////////////////////////////
export async function index(request, response, next) {
    try {
        const orders = await PurchaseOrder.find()
            .populate("supplier")
            .populate("employee")
            .populate("ingredients");
        return response.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////////
///// GET - SINGLE PURCHASE ORDER /////
///////////////////////////////////////
export async function show(request, response, next) {
    try {
        const order = await PurchaseOrder.findById(request.params.id)
            .populate("supplier")
            .populate("employee")
            .populate("ingredients");
        if (!order) return next(createError(404, "Purchase order not found"));
        return response.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////////////
///// POST - CREATE PURCHASE ORDER /////
////////////////////////////////////////
export async function create(request, response, next) {
    try {
        const { supplierId, employeeId, ingredients, totalCost, status } = request.body;

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) return next(createError(404, "Supplier not found"));

        const employee = await Employee.findById(employeeId);
        if (!employee) return next(createError(404, "Employee not found"));

        const order = await PurchaseOrder.create({
            supplier: supplier._id,
            employee: employee._id,
            ingredients,
            totalCost,
            status,
        });

        return response.status(201).json({
            message: "Purchase order created successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////////
///// PUT - UPDATE PURCHASE ORDER /////
///////////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const order = await PurchaseOrder.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!order) return next(createError(404, "Purchase order not found"));
        return response.status(200).json({
            message: "Purchase order updated successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////
///// DELETE - PURCHASE ORDER /////
///////////////////////////////////
export async function remove(request, response, next) {
    try {
        const order = await PurchaseOrder.findByIdAndDelete(request.params.id);
        if (!order) return next(createError(404, "Purchase order not found"));
        return response.status(200).json({
            message: "Purchase order deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
