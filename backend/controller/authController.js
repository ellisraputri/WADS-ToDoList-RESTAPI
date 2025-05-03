import bcrypt from 'bcryptjs';
import fs from 'fs';
import { promisify } from 'util';
import { uploadToCloudinary } from '../config/cloudinary.js';
import User from '../models/userModel.js';

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
}

export const register = async (req, res) => {
    const { fullName, email, password, secretKey } = req.body;

    if (!fullName || !email || !password || !secretKey) {
        return res.status(400).json({ success: false, message: "Please fill all the required fields" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedKey = await bcrypt.hash(secretKey, 10);
        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            secretKey: hashedKey,
        });

        req.session.userId = newUser.id;
        return res.status(200).json({ success: true, message: "Account created successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const login = async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    try {
        const user = await User.findOne({ where: { email } });
        if(!user){
            return res.status(400).json({success:false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Invalid credentials"})
        }

        req.session.userId = user.id;
        return res.status(200).json({success:true, message:"Logged in successfully"});


    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

 
export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
        res.clearCookie('connect.sid'); // Optional: clear cookie
        return res.json({ success: true, message: 'Logged out' });
    });
};

export const isAuthenticated =async(req,res)=>{
    try {
        return res.status(200).json({success:true})   
    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const verifySecretKey = async(req,res)=>{
    const {email, key} =req.body;

    if(!email || !key ){
        return res.status(400).json({success:false, message:"Missing details"});
    }

    try {
        const user = await User.findOne({ where: { email } });
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const isMatch = await bcrypt.compare(key, user.secretKey);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Invalid key"}) 
        }

        return res.status(200).json({success:true, message:'Secret key is valid'})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const resetPassword = async(req,res)=>{
    const {email, newPassword} =req.body;

    if(!email || !newPassword){
        return res.status(400).json({success:false, message:"Missing details"});
    }

    try {
        const user = await User.findOne({ where: { email } });
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        
        if(!isValidPassword(newPassword)){
            return res.status(400).json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password=hashedPassword;
        await user.save();
        
        return res.status(200).json({success:true, message:'Password has been reset successfully'})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const getUserData = async(req,res)=>{
    try {
        const {userId} = req.body;
        const user = await User.findByPk(userId); 
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        return res.status(200).json({success:true, userData: user})
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const updateBio = async(req,res)=>{
    try {
        const {userId, newbio} = req.body;
        if(!newbio){
            return res.status(400).json({success:false, message:"Please fill in the bio."});
        }
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        user.bio = newbio;
        await user.save();

        return res.status(200).json({ success: true, message: "Bio updated successfully" });

        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const updateProfile =async(req,res)=>{
    const {userId, imageUrl} =req.body;
    try {
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        user.profileImage = imageUrl;
        await user.save();

        return res.status(200).json({success:true, message:"Profile image updated successfully"});

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}



const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

export const uploadImage = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const tempFilePath = req.file.path; // multer gives you the path
  
    try {
      const fileUrl = await uploadToCloudinary(tempFilePath);
  
      // Clean up the uploaded file from local storage
      await unlinkAsync(tempFilePath);
  
      return res.json({ imageUrl: fileUrl });
    } catch (err) {
      console.error('Upload error:', err);
  
      if (fs.existsSync(tempFilePath)) {
        try {
          await unlinkAsync(tempFilePath);
        } catch (cleanupErr) {
          console.error('Error during cleanup:', cleanupErr);
        }
      }
  
      return res.status(500).json({ error: 'Failed to process image upload' });
    }
  };
  