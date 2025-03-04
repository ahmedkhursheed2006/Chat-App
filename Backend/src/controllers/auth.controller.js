import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary"

export const signup = async (req, res) => {
    const { fullName, password, email } = req.body;
    try {
        if (!fullName || !password || !email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already in use" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Invalid USer Data" })
        }
    } catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ message: "Server Error" })

    }
}
export const login = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Creadentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Creadentials" })
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out" })

    } catch (error) {
        console.log("Error in logout", error.message);
        res.status(500).json({ message: "Server Error" })
    }
};
export const updateProfile = async (req, res) => {
    try {
       const {profilePic} = req.body
       const userID = req.user._id

       if(!profilePic){
           return res.status(400).json({message: "Profile Pic is required"})
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic)
       const updatedUser = await User.findByIdAndUpdate(userID, {profilePic: uploadResponse.secure_url}, {new: true})
       res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile", error.message);
        res.status(500).json({ message: "Server Error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth", error.message);
        res.status(500).json({ message: "Server Error" })   
    }
}