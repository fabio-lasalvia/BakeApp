import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";

///// Import models /////
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import Catalog from "../models/Catalog.js";
import CustomerOrder from "../models/CustomerOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Ingredient from "../models/Ingredient.js";
import Invoice from "../models/Invoice.js";

dotenv.config();

////////////////////////////////////
///// SEED INITIAL SAMPLE DATA /////
////////////////////////////////////
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    // Clear collections
    await Promise.all([
      User.deleteMany(),
      Customer.deleteMany(),
      Employee.deleteMany(),
      Supplier.deleteMany(),
      Product.deleteMany(),
      Catalog.deleteMany(),
      CustomerOrder.deleteMany(),
      PurchaseOrder.deleteMany(),
      Ingredient.deleteMany(),
      Invoice.deleteMany(),
    ]);

    console.log("Old data cleared");

    // Hash password
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    ////////////////////////////////
    ///// USERS ////////////////////
    ////////////////////////////////
    const admin = await User.create({
      name: "Jack",
      surname: "Admin",
      email: "admin@bakeapp.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    const employeeUser = await User.create({
      name: "Laura",
      surname: "Rossi",
      email: "employee@bakeapp.com",
      password: hashedPassword,
      role: "EMPLOYEE",
    });

    const supplierUser = await User.create({
      name: "Mauro",
      surname: "Fornitore",
      email: "supplier@bakeapp.com",
      password: hashedPassword,
      role: "SUPPLIER",
    });

    const customerUser = await User.create({
      name: "Elena",
      surname: "Cliente",
      email: "customer@bakeapp.com",
      password: hashedPassword,
      role: "CUSTOMER",
    });

    ////////////////////////////////
    ///// ROLES & RELATIONS ////////
    ////////////////////////////////
    const employee = await Employee.create({
      user: employeeUser._id,
      name: employeeUser.name,
      department: "PRODUCTION",
    });

    const supplier = await Supplier.create({
      user: supplierUser._id,
      companyName: "Sweet Ingredients SRL",
      contact: "sweet@example.com",
      vatNumber: "IT12345678901",
    });

    const customer = await Customer.create({
      user: customerUser._id,
      phone: "+39 3456789012",
      address: "Via delle Rose 12, Milano",
    });

    employeeUser.employee = employee._id;
    supplierUser.supplier = supplier._id;
    customerUser.customer = customer._id;

    await Promise.all([
      employeeUser.save(),
      supplierUser.save(),
      customerUser.save(),
    ]);

    //////////////////////////////
    ///// CATALOG & PRODUCTS /////
    //////////////////////////////
    const catalog = await Catalog.create({
      name: "Default Catalog",
      description: "Main product list for MyBakeApp",
    });

    const product1 = await Product.create({
      name: "Chocolate Cake",
      description: "Rich and moist chocolate cake",
      price: 25.5,
      catalog: catalog._id,
    });

    const product2 = await Product.create({
      name: "Croissant",
      description: "Fresh butter croissant",
      price: 2.0,
      catalog: catalog._id,
    });

    catalog.products = [product1._id, product2._id];
    await catalog.save();

    //////////////////////////
    ///// CUSTOMER ORDER /////
    //////////////////////////
    const order = await CustomerOrder.create({
      customer: customer._id,
      employee: employee._id,
      products: [product1._id, product2._id],
      totalAmount: 27.5,
      status: "PENDING",
      notes: "Delivery on Monday morning",
    });

    //////////////////////////
    ///// PURCHASE ORDER /////
    //////////////////////////
    const ingredient1 = await Ingredient.create({
      name: "Flour",
      quantity: 10,
      unit: "kg",
      cost: 8,
    });

    const ingredient2 = await Ingredient.create({
      name: "Chocolate",
      quantity: 5,
      unit: "kg",
      cost: 20,
    });

    const purchaseOrder = await PurchaseOrder.create({
      supplier: supplier._id,
      employee: employee._id,
      ingredients: [ingredient1._id, ingredient2._id],
      totalCost: 28,
      status: "ORDERED",
    });

    ingredient1.purchaseOrder = purchaseOrder._id;
    ingredient2.purchaseOrder = purchaseOrder._id;
    await ingredient1.save();
    await ingredient2.save();

    ///////////////////
    ///// INVOICE /////
    ///////////////////
    await Invoice.create({
      customerOrder: order._id,
      total: 27.5,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "UNPAID",
    });

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
