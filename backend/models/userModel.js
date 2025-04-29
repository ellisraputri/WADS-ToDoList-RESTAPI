import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    bio: { type: String, default:'' }, 
    profileImage: { type: String, default:'' }, 
    secretKey: { type: String, required:true}
  }, { timestamps:true});

const userModel = mongoose.models.user || mongoose.model('user', UserSchema);

export default userModel