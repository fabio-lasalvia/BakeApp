import mongoose from "mongoose";

///// Import models /////
import CustomerOrder from "../models/CustomerOrder.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Product from "../models/Product.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

/////////////////////////////////////
///// GET - ALL CUSTOMER ORDERS /////
/////////////////////////////////////
export async function index(request, response, next) {
    try {
        const orders = await CustomerOrder.find()
            .populate("customer")
            .populate("employee")
            .populate("products");
        return response.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////////
///// GET - SINGLE CUSTOMER ORDER /////
///////////////////////////////////////
export async function show(request, response, next) {
    try {
        const order = await CustomerOrder.findById(request.params.id)
            .populate("customer")
            .populate("employee")
            .populate("products");
        if (!order) return next(createError(404, "Customer order not found"));
        return response.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////////////
///// POST - CREATE CUSTOMER ORDER /////
////////////////////////////////////////
export async function create(request, response, next) {
    try {
        const { customerId, employeeId, products, totalAmount, status } = request.body;

        const customer = await Customer.findById(customerId);
        if (!customer) return next(createError(404, "Customer not found"));

        const employee = await Employee.findById(employeeId);
        if (!employee) return next(createError(404, "Employee not found"));

        const order = await CustomerOrder.create({
            customer: customer._id,
            employee: employee._id,
            products,
            totalAmount,
            status,
        });

        return response.status(201).json({
            message: "Customer order created successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////////
///// PUT - UPDATE CUSTOMER ORDER /////
///////////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const order = await CustomerOrder.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!order) return next(createError(404, "Customer order not found"));
        return response.status(200).json({
            message: "Customer order updated successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////
///// DELETE - CUSTOMER ORDER /////
///////////////////////////////////
export async function remove(request, response, next) {
    try {
        const order = await CustomerOrder.findByIdAndDelete(request.params.id);
        if (!order) return next(createError(404, "Customer order not found"));
        return response.status(200).json({
            message: "Customer order deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
