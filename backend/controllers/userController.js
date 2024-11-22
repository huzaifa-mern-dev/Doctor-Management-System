import validator from "validator";

import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
// api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be of atleast 6 characters",
      });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    console.log(error); // Log the specific error
    res.status(500).json({
      success: false,
      message: "An error occurred while registering user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
        message: "User logged in successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error); // Log the specific error
    res.status(500).json({
      success: false,
      message: "An error occurred while login user",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error); // Log the specific error
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    console.log(error); // Log the specific error
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user profile",
      error: error.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, docid, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docid).select("-password");

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);

    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docid,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fee,
      date: Date.now(),
    };
    const newAppointment = await appointmentModel.create(appointmentData);
    const appointment = await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docid, { slots_booked });
    res.json({
      success: true,
      appointment,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error); // Log the specific error
    res.status(500).json({
      success: false,
      message: "An error occurred while booking appointment",
      error: error.message,
    });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment};
