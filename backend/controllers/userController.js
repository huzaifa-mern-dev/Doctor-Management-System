import validator from "validator";

import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// api to register user



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password should be of atleast 6 characters" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        name,
        email,
        password: hashedPassword,
    };

    // save user to database
    const newUser = await userModel.create(userData);
    const user = await newUser.save();

const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET )

res.json({success: true, token, message: "User registered successfully"});


    } catch (error) {
        console.log(error); // Log the specific error
        res.status(500).json({
            success: false,
            message: "An error occurred while registering user",
            error: error.message,
        });
        

        
    }
}



export { registerUser };