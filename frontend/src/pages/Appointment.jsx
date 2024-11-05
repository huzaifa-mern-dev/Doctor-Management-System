import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
// import { assets } from "../assets/assets_frontend/assets";


const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [DocSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];




  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return (
    // doctorInfo && 
    (
      <div>
        {/* doctorInfo.image */}

        <div className="">
          <div className="">
            <img src={docInfo.image} alt="" />
          </div>

          <div className="">
            {/* name degree speciality */}
            <p className="">
              {docInfo.name} <img src={assets.verified_icon} alt="" />
            </p>
          </div>
        </div>
      </div>
    )
  );
};
export default Appointment;