// import {assets} from '../assets/assets_admin'
import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          console.log(data.token);
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          // window.location.href = "/admin";
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span>Login
        </p>
        <div className="w-full">
          <p className="">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p className=" cursor-pointer" onClick={() => setState("Doctor")}>
            Doctor Login? <span className="text-primary">CLick here</span>
          </p>
        ) : (
          <p className="cursor-pointer" onClick={() => setState("Admin")}>
            Admin Login? <span className="text-primary">CLick here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;