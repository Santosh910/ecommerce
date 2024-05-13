import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../../styles/AuthStyles.css"

const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });

  const router = useNavigate();

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        { inputs }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        router("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title="Register-Ecommer App">
      <div className=" form-container " style={{minHeight:"90vh"}}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Your Name"
              required
              autoFocus
              onChange={handleChange}
            />
          </div>
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
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter Your phone"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Enter Your address"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="answer"
              className="form-control"
              placeholder="what is your favorite sports"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
