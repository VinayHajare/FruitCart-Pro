require("dotenv").config({ path: process.cwd() + "/.env.local" })
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

// Define User Schema (simplified version of your actual schema)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

// Create indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })

// Create User model
const User = mongoose.models.User || mongoose.model("User", UserSchema)

async function createAdminUser() {
  try {
    await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "vinayhajare2004@gmail.com" })
    if (existingAdmin) {
      console.log("Admin already exists")

      // Update password if needed
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("Vinay2324", salt)

      existingAdmin.password = hashedPassword
      await existingAdmin.save()
      console.log("Admin password updated successfully")

      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("Vinay2324", salt)

    // Create admin user
    const admin = new User({
      name: "Vinay Hajare",
      username: "admin",
      email: "vinayhajare2004@gmail.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    })

    await admin.save()
    console.log("Admin created successfully")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
    process.exit()
  }
}

createAdminUser()

