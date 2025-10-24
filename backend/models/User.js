import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: { type: String, minlength: 6 },
    googleId: { type: String, sparse: true },
    avatar: {
  type: String,
  default:
    "https://res.cloudinary.com/dbqckc5sl/image/upload/v1759400955/segnapostoNoImage_rumvcb.png",
},

    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER", "EMPLOYEE", "SUPPLIER"],
      default: "CUSTOMER",
      required: true,
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
