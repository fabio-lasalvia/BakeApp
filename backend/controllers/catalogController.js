import mongoose from "mongoose";

///// Import models /////
import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

//////////////////////////////
///// GET - ALL CATALOGS /////
//////////////////////////////
export async function index(request, response, next) {
    try {
        const catalogs = await Catalog.find().populate("products");
        return response.status(200).json(catalogs);
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// GET - SINGLE CATALOG /////
////////////////////////////////
export async function show(request, response, next) {
    try {
        const catalog = await Catalog.findById(request.params.id).populate("products");
        if (!catalog) return next(createError(404, "Catalog not found"));
        return response.status(200).json(catalog);
    } catch (error) {
        next(error);
    }
}

/////////////////////////////////
///// POST - CREATE CATALOG /////
/////////////////////////////////
export async function create(request, response, next) {
    try {
        const { name, description, products } = request.body;

        const catalog = await Catalog.create({
            name,
            description,
            products: products || [],
        });

        return response.status(201).json({
            message: "Catalog created successfully",
            catalog,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////////
///// PUT - UPDATE CATALOG /////
////////////////////////////////
export async function update(request, response, next) {
    try {
        const updates = request.body;
        const catalog = await Catalog.findByIdAndUpdate(request.params.id, updates, { new: true });
        if (!catalog) return next(createError(404, "Catalog not found"));
        return response.status(200).json({
            message: "Catalog updated successfully",
            catalog,
        });
    } catch (error) {
        next(error);
    }
}

////////////////////////////
///// DELETE - CATALOG /////
////////////////////////////
export async function remove(request, response, next) {
    try {
        const catalog = await Catalog.findByIdAndDelete(request.params.id);
        if (!catalog) return next(createError(404, "Catalog not found"));
        return response.status(200).json({
            message: "Catalog deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}
