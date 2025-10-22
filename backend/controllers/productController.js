import mongoose from "mongoose";

///// Import models /////
import Product from "../models/Product.js";
import CustomerOrder from "../models/CustomerOrder.js";
import Catalog from "../models/Catalog.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

//////////////////////////////
///// GET - ALL PRODUCTS /////
//////////////////////////////
export async function index(request, response, next) {
    try {
        const products = await Product.find()
            .populate("catalog")
            .populate("customerOrder");
        return response.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// GET - SINGLE PRODUCT /////
////////////////////////////////
export async function show(request, response, next) {
    try {
        const product = await Product.findById(request.params.id)
            .populate("catalog")
            .populate("customerOrder");
        if (!product) return next(createError(404, "Product not found"));
        return response.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// POST - CREATE PRODUCT /////
/////////////////////////////////
export async function create(request, response, next) {
    try {
        const { name, price, description, catalogId, customerOrderId } = request.body;

        const catalog = await Catalog.findById(catalogId);
        if (!catalog) return next(createError(404, "Catalog not found"));

        const product = await Product.create({
            name,
            price,
            description,
            catalog: catalog._id,
            customerOrder: customerOrderId || null,
        });

        return response.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// PUT - UPDATE PRODUCT /////
////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const product = await Product.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!product) return next(createError(404, "Product not found"));
        return response.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////
///// DELETE - PRODUCT /////
////////////////////////////
export async function remove(request, response, next) {
    try {
        const product = await Product.findByIdAndDelete(request.params.id);
        if (!product) return next(createError(404, "Product not found"));
        return response.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
