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
      .populate("ingredients.ingredient");

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
      .populate("ingredients.ingredient");

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
    const { supplierId, ingredients, status, expectedDelivery } = request.body;

    // Validazioni base
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return next(createError(404, "Supplier not found"));

    if (!ingredients || ingredients.length === 0)
      return next(createError(400, "At least one ingredient is required"));

    // Validazione ingredienti e calcolo del totale
    const ingredientIds = ingredients.map((item) => item.ingredient);
    const validIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });

    if (validIngredients.length !== ingredients.length)
      return next(createError(400, "Some ingredients not found"));

    // Calcolo totale
    const totalCost = ingredients.reduce((sum, item) => {
      const found = validIngredients.find(
        (ing) => ing._id.toString() === item.ingredient
      );
      return sum + (found ? found.cost * (item.quantity || 1) : 0);
    }, 0);

    const handledBy = request.user?._id || null;
    if (!handledBy) return next(createError(401, "Unauthorized"));

    // Crea ordine
    let order = await PurchaseOrder.create({
      supplier: supplier._id,
      handledBy,
      ingredients,
      totalCost,
      status,
      expectedDelivery,
    });

    order = await order.populate([
      {
        path: "supplier",
        populate: { path: "user", select: "name surname email role" },
      },
      { path: "handledBy", select: "name surname email role" },
      { path: "ingredients.ingredient" },
    ]);

    return response.status(201).json({
      message: "Purchase order created successfully",
      order,
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
    const { ingredients, status, expectedDelivery } = request.body;

    const updates = {
      status,
      expectedDelivery,
      updatedBy: request.user?._id || null,
    };

    let totalCost;

    // Se nuovi ingredienti - ricalcolo totale
    if (ingredients && ingredients.length > 0) {
      const ingredientIds = ingredients.map((item) => item.ingredient);
      const validIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });

      if (validIngredients.length !== ingredients.length)
        return next(createError(400, "Some ingredients not found"));

      totalCost = ingredients.reduce((sum, item) => {
        const found = validIngredients.find(
          (ing) => ing._id.toString() === item.ingredient
        );
        return sum + (found ? found.cost * (item.quantity || 1) : 0);
      }, 0);

      updates.ingredients = ingredients;
      updates.totalCost = totalCost;
    }

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
      .populate("ingredients.ingredient");

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
