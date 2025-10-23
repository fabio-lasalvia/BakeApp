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
    const { name, description, price, catalog, customerOrder, available } = request.body;
    const image = request.file?.path || null;

    if (!name || !price) {
      return next(createError(400, "Name and price are required"));
    }

    // Verifica Catalog se presente
    if (catalog) {
      const existingCatalog = await Catalog.findById(catalog);
      if (!existingCatalog) return next(createError(404, "Catalog not found"));
    }

    // Verifica CustomerOrder se presente
    if (customerOrder) {
      const existingOrder = await CustomerOrder.findById(customerOrder);
      if (!existingOrder) return next(createError(404, "Customer order not found"));
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      catalog: catalog || null,
      customerOrder: customerOrder || null,
      available: available !== undefined ? available : true,
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
    const { name, description, price, catalog, customerOrder, available } = request.body;
    const image = request.file?.path;

    const existingProduct = await Product.findById(request.params.id);
    if (!existingProduct) return next(createError(404, "Product not found"));

    if (catalog) {
      const existingCatalog = await Catalog.findById(catalog);
      if (!existingCatalog) return next(createError(404, "Catalog not found"));
    }

    if (customerOrder) {
      const existingOrder = await CustomerOrder.findById(customerOrder);
      if (!existingOrder) return next(createError(404, "Customer order not found"));
    }

    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price !== undefined ? price : existingProduct.price;
    existingProduct.available = available !== undefined ? available : existingProduct.available;
    existingProduct.catalog = catalog || existingProduct.catalog;
    existingProduct.customerOrder = customerOrder || existingProduct.customerOrder;
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

    return response.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
