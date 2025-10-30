import Invoice from "../models/Invoice.js";
import CustomerOrder from "../models/CustomerOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Customer from "../models/Customer.js";
import { createError } from "../helpers/createError.js";

//////////////////////////////
///// GET - ALL INVOICES /////
//////////////////////////////
export async function index(request, response, next) {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "customer",
        populate: { path: "user", select: "name surname email" },
      })
      .populate({
        path: "customerOrder",
        populate: {
          path: "products.product",
          model: "Product",
          select: "name price description image category",
        },
      })
      .populate({
        path: "purchaseOrder",
        populate: {
          path: "ingredients",
          model: "Ingredient",
          select: "name cost quantity unit",
        },
      })
      .populate("handledBy", "name surname email role");

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
      .populate({
        path: "customer",
        populate: { path: "user", select: "name surname email" },
      })
      .populate("handledBy", "name surname email role")
      .populate({
        path: "customerOrder",
        populate: {
          path: "products.product",
          model: "Product",
          select: "name price description image category",
        },
      })
      .populate({
        path: "purchaseOrder",
        populate: {
          path: "ingredients",
          model: "Ingredient",
          select: "name cost quantity unit",
        },
      });

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
    const { customerOrderId, purchaseOrderId, dueDate, status, notes } = request.body;

    if (!customerOrderId && !purchaseOrderId) {
      return next(createError(400, "Invoice must reference a customer or purchase order"));
    }

    const handledBy = request.user?._id;
    if (!handledBy) return next(createError(401, "Unauthorized - missing user info"));

    let customer = null;
    let total = 0;

    // Se la fattura è legata a un ordine cliente
    if (customerOrderId) {
      const order = await CustomerOrder.findById(customerOrderId)
        .populate("customer")
        .populate({
          path: "products.product",
          model: "Product",
        });

      if (!order) return next(createError(404, "Customer order not found"));

      customer = order.customer._id;
      total = order.totalAmount;
    }

    // Se la fattura è legata a un ordine di acquisto
    if (purchaseOrderId) {
      const order = await PurchaseOrder.findById(purchaseOrderId);
      if (!order) return next(createError(404, "Purchase order not found"));
      total = order.totalCost;
    }

    const invoice = await Invoice.create({
      customer,
      handledBy,
      customerOrder: customerOrderId || null,
      purchaseOrder: purchaseOrderId || null,
      total,
      dueDate,
      status,
      notes,
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
    const updates = {
      ...request.body,
      updatedBy: request.user?._id || null,
    };

    const invoice = await Invoice.findByIdAndUpdate(request.params.id, updates, {
      new: true,
    })
      .populate({
        path: "customer",
        populate: { path: "user", select: "name surname email" },
      })
      .populate({
        path: "customerOrder",
        populate: {
          path: "products.product",
          model: "Product",
          select: "name price description image category",
        },
      })
      .populate({
        path: "purchaseOrder",
        populate: {
          path: "ingredients",
          model: "Ingredient",
          select: "name cost quantity unit",
        },
      })
      .populate("handledBy", "name surname email role");

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
