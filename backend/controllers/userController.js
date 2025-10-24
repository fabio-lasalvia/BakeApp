import mongoose from "mongoose";

///// Import models /////
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Supplier from "../models/Supplier.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

///////////////////////////
///// GET - ALL USERS /////
///////////////////////////
export async function index(req, res, next) {
  try {
    const users = await User.find()
      .populate("customer")
      .populate("employee")
      .populate("supplier");
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

/////////////////////////////
///// GET - SINGLE USER /////
/////////////////////////////
export async function show(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .populate("customer")
      .populate("employee")
      .populate("supplier");
    if (!user) return next(createError(404, "User not found"));
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

//////////////////////////////
///// POST - CREATE USER /////
//////////////////////////////
export async function create(req, res, next) {
  try {
    const {
      name,
      surname,
      email,
      password,
      role,
      phone,
      address,
      department,
      companyName,
      contact,
      vatNumber,
    } = req.body;

    // Controlla email duplicata
    const existing = await User.findOne({ email });
    if (existing) return next(createError(400, "Email already registered"));

    // Crea utente base
    const user = await User.create({ name, surname, email, password, role });

    // Crea relazione in base al ruolo
    if (role === "CUSTOMER") {
      const customer = await Customer.create({
        user: user._id,
        phone,
        address,
      });
      user.customer = customer._id;
    }

    if (role === "EMPLOYEE") {
      const employee = await Employee.create({
        user: user._id,
        department,
      });
      user.employee = employee._id;
    }

    if (role === "SUPPLIER") {
      const supplier = await Supplier.create({
        user: user._id,
        companyName,
        contact,
        vatNumber,
      });
      user.supplier = supplier._id;
    }

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

/////////////////////////////
///// PUT - UPDATE USER /////
/////////////////////////////
export async function update(req, res, next) {
  try {
    const updates = req.body;
    const user = await User.findById(req.params.id)
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    if (!user) return next(createError(404, "User not found"));

    // Aggiorna solo i campi base
    if (updates.name) user.name = updates.name;
    if (updates.surname) user.surname = updates.surname;
    if (updates.email) user.email = updates.email;
    if (updates.password) user.password = updates.password;

    await user.save();

    // Aggiorna entità collegate
    if (user.role === "CUSTOMER" && user.customer) {
      await Customer.findByIdAndUpdate(user.customer, {
        phone: updates.phone,
        address: updates.address,
      });
    }

    if (user.role === "EMPLOYEE" && user.employee) {
      await Employee.findByIdAndUpdate(user.employee, {
        department: updates.department,
      });
    }

    if (user.role === "SUPPLIER" && user.supplier) {
      await Supplier.findByIdAndUpdate(user.supplier, {
        companyName: updates.companyName,
        contact: updates.contact,
        vatNumber: updates.vatNumber,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////
///// DELETE - SINGLE USER /////
////////////////////////////////
export async function remove(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found"));

    if (user.customer) await Customer.findByIdAndDelete(user.customer);
    if (user.employee) await Employee.findByIdAndDelete(user.employee);
    if (user.supplier) await Supplier.findByIdAndDelete(user.supplier);

    await User.findByIdAndDelete(user._id);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////
///// PATCH - UPDATE USER ROLE /////
////////////////////////////////////
export async function updateRole(req, res, next) {
  try {
    const { role } = req.body;

    // Solo admin può cambiare ruoli
    if (req.user.role !== "ADMIN")
      return next(createError(403, "Only admin can change roles"));

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return next(createError(404, "User not found"));

    return res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}
