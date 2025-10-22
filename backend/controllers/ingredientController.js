import mongoose from "mongoose";

///// Import models /////
import Ingredient from "../models/Ingredient.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

/////////////////////////////////
///// GET - ALL INGREDIENTS /////
/////////////////////////////////
export async function index(request, response, next) {
    try {
        const ingredients = await Ingredient.find().populate("purchaseOrder");
        return response.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////
///// GET - SINGLE INGREDIENT /////
///////////////////////////////////
export async function show(request, response, next) {
    try {
        const ingredient = await Ingredient.findById(request.params.id).populate("purchaseOrder");
        if (!ingredient) return next(createError(404, "Ingredient not found"));
        return response.status(200).json(ingredient);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////////
///// POST - CREATE INGREDIENT /////
////////////////////////////////////
export async function create(request, response, next) {
    try {
        const { purchaseOrderId, name, quantity, unit, cost } = request.body;

        const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) return next(createError(404, "Purchase order not found"));

        const ingredient = await Ingredient.create({
            purchaseOrder: purchaseOrder._id,
            name,
            quantity,
            unit,
            cost,
        });

        return response.status(201).json({
            message: "Ingredient created successfully",
            ingredient,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////////
///// PUT - UPDATE INGREDIENT /////
///////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const ingredient = await Ingredient.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!ingredient) return next(createError(404, "Ingredient not found"));
        return response.status(200).json({
            message: "Ingredient updated successfully",
            ingredient,
        });
    } catch (error) {
        next(error);
    }
}

///////////////////////////////
///// DELETE - INGREDIENT /////
///////////////////////////////
export async function remove(request, response, next) {
    try {
        const ingredient = await Ingredient.findByIdAndDelete(request.params.id);
        if (!ingredient) return next(createError(404, "Ingredient not found"));
        return response.status(200).json({
            message: "Ingredient deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
