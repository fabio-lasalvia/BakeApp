import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const email = "studio.fabio.lasalvia@gmail.com";
    const password = "123456";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    const admin = new User({
      name: "Fabio",
      surname: "La Salvia",
      email,
      password,
      role: "ADMIN",
    });

    await admin.save();
    console.log("Admin user created successfully:", email);

    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating admin:", error);
    process.exit(1);
  });
