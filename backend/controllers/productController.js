import mongoose from "mongoose";

///// Import models /////
import Product from "../models/Product.js";
import Catalog from "../models/Catalog.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

//////////////////////////////
///// GET - ALL PRODUCTS /////
//////////////////////////////
export async function index(request, response, next) {
  try {
    const query = {};
    if (request.query.catalog) {
      query.catalog = request.query.catalog;
    }

    const products = await Product.find(query).populate("catalog");
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
    const product = await Product.findById(request.params.id).populate("catalog");
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
    const { name, description, price, category, catalog, available } = request.body;
    const image = request.file?.path || null;

    if (!name || !price || !category)
      return next(createError(400, "Name, price and category are required"));

    if (catalog) {
      const existingCatalog = await Catalog.findById(catalog);
      if (!existingCatalog) return next(createError(404, "Catalog not found"));
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      catalog: catalog || null,
      available: available ?? true,
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
    const { name, description, price, category, catalog, available } = request.body;
    const image = request.file?.path;

    const existingProduct = await Product.findById(request.params.id);
    if (!existingProduct) return next(createError(404, "Product not found"));

    if (catalog) {
      const existingCatalog = await Catalog.findById(catalog);
      if (!existingCatalog) return next(createError(404, "Catalog not found"));
    }

    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price ?? existingProduct.price;
    existingProduct.category = category || existingProduct.category;
    existingProduct.available = available ?? existingProduct.available;
    existingProduct.catalog = catalog || existingProduct.catalog;
    if (image) existingProduct.image = image;

    await existingProduct.save();

    return response.status(200).json({
      message: "Product updated successfully",
      product: existingProduct,
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
    const deletedProduct = await Product.findByIdAndDelete(request.params.id);
    if (!deletedProduct) return next(createError(404, "Product not found"));

    return response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
}
