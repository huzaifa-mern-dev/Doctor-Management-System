import { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData} = useContext(AppContext)
  const [image, setImage] = useState(false);
  
  

  const [isEdit, setIsEdit] = useState(false);

  const updateUserProfileData = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phone", userData.phone);
    formData.append("image", image);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          token,
        },
      });
      if (data.success) {
        toast.success(data.message);
        loadUserProfileData();
        setIsEdit(false);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }
  return userData && (
  <div>
    {
      isEdit 
      ? 
      <label htmlFor="image">
      <div>
      <img src={image ? URL.createObjectURL(image) : userData.image} alt="" />
      <img src={image ? "" : assets.upload_icon} alt="" />
      </div>
      <input onChange={(e)=> setImage(e.target.file[0])} type="file" id="image" hidden />
      
      </label>
    :  
    <img src={userData.image} alt="" />
}

    {
      isEdit 
      ? <input type="text" value={userData.name} onChange={e => setUserData(prev=>({...prev,name:e.target.value}))} />
      : <p>{userData.name}</p> 
    }

    <hr />

    <div className="">
      <p>CONTACT INFORMATION</p>
      <div className="">
        <p>email id:</p>
        <p>{userData.email}</p>
        <p>phone: </p>
        {
      isEdit 
      ? <input type="text" value={userData.phone} onChange={e => setUserData(prev=>({...prev,phone:e.target.value}))} />
      : <p>{userData.phone}</p> 
    }
      </div>
    </div>
  </div>
  )
};


export default MyProfile;