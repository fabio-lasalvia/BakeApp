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
      .populate("products.product");

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
      .populate("products.product");

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

    // validazione cliente
    const customer = await Customer.findById(customerId);
    if (!customer) return next(createError(404, "Customer not found"));

    // validazione prodotti
    if (!products || products.length === 0)
      return next(createError(400, "At least one product is required"));

    const productIds = products.map((p) => p.product);
    const validProducts = await Product.find({ _id: { $in: productIds } });
    if (validProducts.length !== products.length)
      return next(createError(400, "Some products not found"));

    // utente autenticato
    const handledBy = request.user?._id;
    if (!handledBy) return next(createError(401, "Unauthorized"));

    let finalStatus = status;
    if (request.user.role === "CUSTOMER") {
      finalStatus = "PENDING";
    }

    let computedTotal = 0;
    for (const item of products) {
      const product = validProducts.find(
        (p) => p._id.toString() === item.product
      );
      if (product) computedTotal += product.price * (item.quantity || 1);
    }

    const finalTotal = totalAmount ?? computedTotal;

    const order = await CustomerOrder.create({
      customer: customer._id,
      handledBy,
      products,
      totalAmount: finalTotal,
      status: finalStatus,
      notes,
    });

    const populatedOrder = await order.populate([
      {
        path: "customer",
        populate: { path: "user", select: "name surname email role" },
      },
      { path: "handledBy", select: "name surname email role" },
      { path: "products.product" },
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
    const { products, totalAmount, status, notes } = request.body;
    const updatedBy = request.user?._id || null;

    const order = await CustomerOrder.findById(request.params.id);
    if (!order) return next(createError(404, "Customer order not found"));

    // aggiornamento prodotti e totale (se presenti)
    if (products && Array.isArray(products)) {
      const productIds = products.map((p) => p.product);
      const validProducts = await Product.find({ _id: { $in: productIds } });

      if (validProducts.length !== products.length)
        return next(createError(400, "Some products not found"));

      order.products = products;

      // ricalcolo del totale
      let newTotal = 0;
      for (const item of products) {
        const product = validProducts.find(
          (p) => p._id.toString() === item.product
        );
        if (product) newTotal += product.price * item.quantity;
      }
      order.totalAmount = totalAmount ?? newTotal;
    }

    if (status) order.status = status;
    if (notes) order.notes = notes;
    order.updatedBy = updatedBy;

    await order.save();

    const populatedOrder = await order.populate([
      {
        path: "customer",
        populate: { path: "user", select: "name surname email role" },
      },
      { path: "handledBy", select: "name surname email role" },
      { path: "updatedBy", select: "name surname email role" },
      { path: "products.product" },
    ]);

    return response.status(200).json({
      message: "Customer order updated successfully",
      order: populatedOrder,
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
