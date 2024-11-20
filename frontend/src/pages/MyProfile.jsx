import { useContext, useState } from "react";
// import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { userData, setUserData} = useContext(AppContext)
  

  const [isEdit, setIsEdit] = useState(false);
  return userData && (
  <div>
    <img src={userData.image} alt="" />

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