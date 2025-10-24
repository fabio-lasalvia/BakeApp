import CustomerOrder from "../models/CustomerOrder.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { createError } from "../helpers/createError.js";

/////////////////////////////////////
///// GET - ALL CUSTOMER ORDERS /////
/////////////////////////////////////
export async function index(request, response, next) {
  try {
    const orders = await CustomerOrder.find()
      .populate({
        path: "customer",
        populate: {
          path: "user",
          select: "name surname email role",
        },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
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
      .populate({
        path: "customer",
        populate: {
          path: "user",
          select: "name surname email role",
        },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
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
    const { customerId, products, totalAmount, status, notes } = request.body;

    const customer = await Customer.findById(customerId);
    if (!customer) return next(createError(404, "Customer not found"));

    if (!products || products.length === 0)
      return next(createError(400, "At least one product is required"));

    const validProducts = await Product.find({ _id: { $in: products } });
    if (validProducts.length !== products.length)
      return next(createError(400, "Some products not found"));

    const handledBy = request.user?._id || null;
    if (!handledBy) return next(createError(401, "Unauthorized"));

    const order = await CustomerOrder.create({
      customer: customer._id,
      handledBy,
      products,
      totalAmount,
      status,
      notes,
    });

    const populatedOrder = await order.populate([
      {
        path: "customer",
        populate: { path: "user", select: "name surname email role" },
      },
      { path: "handledBy", select: "name surname email role" },
      { path: "products" },
    ]);

    return response.status(201).json({
      message: "Customer order created successfully",
      order: populatedOrder,
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
    const updates = {
      ...request.body,
      updatedBy: request.user?._id || null,
    };

    const order = await CustomerOrder.findByIdAndUpdate(
      request.params.id,
      updates,
      { new: true }
    )
      .populate({
        path: "customer",
        populate: { path: "user", select: "name surname email role" },
      })
      .populate("handledBy", "name surname email role")
      .populate("updatedBy", "name surname email role")
      .populate("products");

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
