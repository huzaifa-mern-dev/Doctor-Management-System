import doctorModel from "../models/doctorModel.js";

 
 const changeAvailability = async (req, res) => {
    try {
        const {docId} = req.body;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available});
        res.json({success:true, message:"Availability changed successfully"});
        
    } catch (error) {
        console.log(error); // Log the specific error
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching doctors",
            error: error.message,
          });
    }
 }

 export {changeAvailability}