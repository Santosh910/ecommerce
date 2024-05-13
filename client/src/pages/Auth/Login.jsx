import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../../styles/AuthStyles.css"
import { useAuth } from "../../context/auth";



const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const[auth,setAuth] = useAuth()

  const router = useNavigate();
  const location = useLocation()

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/login", {
        inputs,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({...auth,user:res.data.user,token:res.data.token});
        localStorage.setItem("auth",JSON.stringify(res.data))
        router(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title="Login-Ecommer App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title mb-2 font-bold">LOGIN FORM</h4>
          
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Your email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Your password"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <button type="button" className="btn forgot-btn" onClick={()=>router("/forgot-password")}>FORGOT PASSWORD</button>
            
          </div>
          
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
