///////////////////////////////
///// IMPORT BASE MODULES /////
///////////////////////////////
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";
import expressListEndpoints from "express-list-endpoints";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

/////////////////////////
///// IMPORT CONFIG /////
/////////////////////////
import connectDB from "./config/db.js";
import { configurePassport } from "./config/passport.config.js";

//////////////////////////////
///// IMPORT MIDDLEWARES /////
//////////////////////////////
import {errorHandler} from "./middlewares/common/errorHandler.js";

/////////////////////////
///// IMPORT ROUTES /////
/////////////////////////
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import customerOrderRoutes from "./routes/customerOrderRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";

//////////////////////////
///// INITIALIZATION /////
//////////////////////////
connectDB();

const app = express();
const server = http.createServer(app);

///// Passport Setup /////
configurePassport(passport);
app.use(passport.initialize());

///// Socket.io setup /////
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

////////////////////////////
///// CORE MIDDLEWARES /////
////////////////////////////
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//////////////////////
///// API ROUTES /////
//////////////////////
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/catalogs", catalogRoutes);

////////////////////////
///// SWAGGER DOCS /////
////////////////////////
const doc = {
    info: {
        title: "MyBakeApp API Documentation",
        description: "REST API for MyBakeApp Bakery Management System",
    },
    host: "localhost:5000",
    schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    const swaggerFilePath = "./swagger_output.json";

    if (fs.existsSync(swaggerFilePath)) {
        const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
        app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
        console.log("Swagger documentation loaded successfully.");
    } else {
        console.warn("Swagger file not found. Run the app once to generate it.");
    }
});

/////////////////////////
///// ROOT ENDPOINT /////
/////////////////////////
app.get("/", (request, response) => {
    response.status(200).json({
        message: "Welcome to MyBakeApp API 🎂",
        version: "1.0.0",
        endpoints: expressListEndpoints(app),
    });
});

/////////////////////////
///// ERROR HANDLER /////
/////////////////////////
app.use(errorHandler);

/////////////////////////
///// SERVER LISTEN /////
/////////////////////////
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api/docs`);
});
