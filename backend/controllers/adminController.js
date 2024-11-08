import validator from "validator"; 
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";

import doctorModel from '../models/doctorModel.js';


 const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address}= req.body;
        const imageFile = req.file;


        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile){
            return res.status(400).json({message: 'All fields are required'});
        }
         
        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Invalid email address'});
        }

        if(password.length < 8){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image"
       });

       const imageUrl = imageUpload.secure_url;

       const doctorData = {
           name,
           email,
           image: imageUrl,
           password: hashedPassword,
           speciality,
           degree,
           experience,
           about,
           fees,
           address:JSON.parse(address),
           date: new Date()
       };

       const newDoctor = new doctorModel(doctorData);

         await newDoctor.save();
 
    } catch (error) {
        console.log(error);
        res.status(404).json({message: 'SOMETHING WENT WRONG'});
    }


 }

 export {addDoctor}