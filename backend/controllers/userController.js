import mongoose from "mongoose";

///// Import models /////
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Supplier from "../models/Supplier.js";

///// Import helpers /////
import { createError } from "../helpers/createError.js";

/////
const DEFAULT_AVATAR ="https://res.cloudinary.com/Amministrazione/image/upload/v1730000000/segnapostoNoImage.png";


///////////////////////////
///// GET - ALL USERS /////
///////////////////////////
export async function index(request, response, next) {
  try {
    const users = await User.find()
      .select("-password")
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    return response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

/////////////////////////////
///// GET - SINGLE USER /////
/////////////////////////////
export async function show(request, response, next) {
  try {
    const user = await User.findById(request.params.id)
      .select("-password")
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    if (!user) return next(createError(404, "User not found"));
    return response.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

//////////////////////////////
///// POST - CREATE USER /////
//////////////////////////////
export async function create(request, response, next) {
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
    } = request.body;

    const existing = await User.findOne({ email });
    if (existing) return next(createError(400, "Email already registered"));

    const avatar = request.file?.path || DEFAULT_AVATAR;

    const user = await User.create({
      name,
      surname,
      email,
      password,
      role,
      avatar,
    });

    if (role === "CUSTOMER") {
      const customer = await Customer.create({ user: user._id, phone, address });
      user.customer = customer._id;
    }

    if (role === "EMPLOYEE") {
      const employee = await Employee.create({ user: user._id, department });
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

    return response.status(201).json({
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
export async function update(request, response, next) {
  try {
    const updates = request.body;
    const user = await User.findById(request.params.id)
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    if (!user) return next(createError(404, "User not found"));

    user.name = updates.name || user.name;
    user.surname = updates.surname || user.surname;
    user.email = updates.email || user.email;
    if (updates.password) user.password = updates.password;
    if (request.file?.path) user.avatar = request.file.path;

    await user.save();

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

    return response.status(200).json({
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
export async function remove(request, response, next) {
  try {
    const user = await User.findById(request.params.id);
    if (!user) return next(createError(404, "User not found"));

    if (user.customer) await Customer.findByIdAndDelete(user.customer);
    if (user.employee) await Employee.findByIdAndDelete(user.employee);
    if (user.supplier) await Supplier.findByIdAndDelete(user.supplier);

    await User.findByIdAndDelete(user._id);

    return response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////
///// PATCH - UPDATE USER ROLE /////
////////////////////////////////////
export async function updateRole(request, response, next) {
  try {
    const { role } = request.body;

    if (request.user.role !== "ADMIN")
      return next(createError(403, "Only admin can change roles"));

    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return next(createError(404, "User not found"));

    return response.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

////////////////////////////////////
///// GET - CURRENT USER (/me) /////
////////////////////////////////////
export async function getMe(request, response, next) {
  try {
    const user = await User.findById(request.user._id)
      .select("-password")
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    if (!user) return next(createError(404, "User not found"));

    return response.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

/////////////////////////////////////
///// PUT - UPDATE CURRENT USER /////
/////////////////////////////////////
export async function updateMe(request, response, next) {
  try {
    console.log("Incoming profile update request");
    console.log("User ID:", request.user?._id);
    console.log("Uploaded file:", request.file);
    console.log("Body:", request.body);

    const updates = request.body;

    const user = await User.findById(request.user._id)
      .populate("customer")
      .populate("employee")
      .populate("supplier");

    if (!user) return next(createError(404, "User not found"));

    // Aggiornamento campi base
    if (updates.name) user.name = updates.name;
    if (updates.surname) user.surname = updates.surname;
    if (updates.email) user.email = updates.email;
    if (updates.password) user.password = updates.password;

    // Upload avatar se presente
    if (request.file && request.file.path) {
      console.log("Cloudinary upload success:", request.file.path);
      user.avatar = request.file.path;
    }

    await user.save();

    // Aggiornamento dati collegati
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

    console.log("Profile updated for:", user.email);

    return response.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return next(createError(500, "Internal Server Error"));
  }
}

