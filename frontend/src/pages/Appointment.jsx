import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
// import { assets } from "../assets/assets_frontend/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctorsData, backendUrl } =
    useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [DocSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index

      let currentdate = new Date(today);
      currentdate.setDate(today.getDate() + i);

      // setting date format

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentdate.getDate()) {
        currentdate.setHours(
          currentdate.getHours() > 10 ? currentdate.getHours() + 1 : 10
        );
        currentdate.setMinutes(currentdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentdate.setHours(10);
        currentdate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentdate < endTime) {
        let formattedTime = currentdate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // add slot to array
        timeSlots.push({
          datetime: new Date(currentdate),
          time: formattedTime,
        });

        // increment time by 30 minutes
        currentdate.setMinutes(currentdate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }

    // if (!slotTime) {
    //   return toast.error("Please select a slot to book an appointment");
    // }

    try {

      const date = DocSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1
      let year = date.getFullYear();


      const slotDate = `${day}_${month}_${year}`;
      console.log(slotDate)
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: {
            token,
          },
        }
      );


      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(DocSlots);
  }, [DocSlots]);

  return (
    docInfo && (
      <div className="">
        {/* details */}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-primary w-full sm:max-w-72 rounded-lg">
            <img src={docInfo.image} alt="" />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Info */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* about */}

            <div className="">
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* booking */}

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {DocSlots.length &&
              DocSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDay()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {DocSlots.length &&
              DocSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button onClick={bookAppointment} className="mt-6 bg-primary px-8 py-3 rounded-full text-white text-sm hover:scale-105 transition-all duration-300">
            Book An Appointment
          </button>
        </div>

        {/* listing related doctors */}

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};
export default Appointment;
