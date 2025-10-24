import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Ingredient from "../models/Ingredient.js";
import { createError } from "../helpers/createError.js";

/////////////////////////////////////
///// GET - ALL PURCHASE ORDERS /////
/////////////////////////////////////
export async function index(request, response, next) {
  try {
    const orders = await PurchaseOrder.find()
      .populate({
        path: "supplier",
        populate: { path: "user", select: "name surname email role" },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
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
      .populate({
        path: "supplier",
        populate: { path: "user", select: "name surname email role" },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
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
    const { supplierId, ingredients, totalCost, status, expectedDelivery } =
      request.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return next(createError(404, "Supplier not found"));

    if (!ingredients || ingredients.length === 0)
      return next(createError(400, "At least one ingredient is required"));

    const validIngredients = await Ingredient.find({
      _id: { $in: ingredients },
    });
    if (validIngredients.length !== ingredients.length)
      return next(createError(400, "Some ingredients not found"));

    const handledBy = request.user?._id || null;
    if (!handledBy) return next(createError(401, "Unauthorized"));

    const order = await PurchaseOrder.create({
      supplier: supplier._id,
      handledBy,
      ingredients,
      totalCost,
      status,
      expectedDelivery,
    });

    const populatedOrder = await order.populate([
      {
        path: "supplier",
        populate: { path: "user", select: "name surname email role" },
      },
      { path: "handledBy", select: "name surname email role" },
      { path: "ingredients" },
    ]);

    return response.status(201).json({
      message: "Purchase order created successfully",
      order: populatedOrder,
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
    const updates = {
      ...request.body,
      updatedBy: request.user?._id || null,
    };

    const order = await PurchaseOrder.findByIdAndUpdate(
      request.params.id,
      updates,
      { new: true }
    )
      .populate({
        path: "supplier",
        populate: { path: "user", select: "name surname email role" },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
      .populate("ingredients");

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
