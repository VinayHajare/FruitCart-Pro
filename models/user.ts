import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  username: string
  email: string
  password: string
  role: string
  isActive: boolean
  lastLogin: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true }, // Removed unique: true here
    email: { type: String, required: true }, // Removed unique: true here
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

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.User) {
  UserSchema.index({ email: 1 }, { unique: true })
  UserSchema.index({ username: 1 }, { unique: true })
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

