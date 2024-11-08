 

 const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address}= req.body;
        const image = req.file;

        console.log( name, email, password, speciality, degree, experience, about, fees, address);


    } catch (error) {
        console.log(error);
    }
 }

 export {addDoctor}