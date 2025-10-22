import mongoose from "mongoose";

///// Import models /////
import Invoice from "../models/Invoice.js";
import CustomerOrder from "../models/CustomerOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

//////////////////////////////
///// GET - ALL INVOICES /////
//////////////////////////////
export async function index(request, response, next) {
    try {
        const invoices = await Invoice.find()
            .populate("customerOrder")
            .populate("purchaseOrder");
        return response.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// GET - SINGLE INVOICE /////
////////////////////////////////
export async function show(request, response, next) {
    try {
        const invoice = await Invoice.findById(request.params.id)
            .populate("customerOrder")
            .populate("purchaseOrder");
        if (!invoice) return next(createError(404, "Invoice not found"));
        return response.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// POST - CREATE INVOICE /////
/////////////////////////////////
export async function create(request, response, next) {
    try {
        const { customerOrderId, purchaseOrderId, total, dueDate, status } = request.body;

        if (!customerOrderId && !purchaseOrderId) {
            return next(createError(400, "Invoice must reference an order"));
        }

        const invoice = await Invoice.create({
            customerOrder: customerOrderId || null,
            purchaseOrder: purchaseOrderId || null,
            total,
            dueDate,
            status,
        });

        return response.status(201).json({
            message: "Invoice created successfully",
            invoice,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// PUT - UPDATE INVOICE /////
////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const invoice = await Invoice.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!invoice) return next(createError(404, "Invoice not found"));
        return response.status(200).json({
            message: "Invoice updated successfully",
            invoice,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////
///// DELETE - INVOICE /////
////////////////////////////
export async function remove(request, response, next) {
    try {
        const invoice = await Invoice.findByIdAndDelete(request.params.id);
        if (!invoice) return next(createError(404, "Invoice not found"));
        return response.status(200).json({
            message: "Invoice deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
